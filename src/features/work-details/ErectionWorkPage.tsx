import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Hammer,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  User,
  Zap,
  Tag,
  AlertCircle,
  Filter,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  Copy,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers3,
  ExternalLink
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/table/DataTable';
import type { DataColumn } from '../../components/table/DataTable';
import Drawer from '../../components/Drawer';
import Button from '../../components/Button';
import Chips from '../../components/Chips';
import Loader from '../../components/Loader';
import { addToast } from '../../store/slices/globalSlice';
import type { AppDispatch } from '../../store';
import {
  ListStatesService,
  ListDistrictsService,
  ListBlocksService,
  ListContractorsService,
} from '../../services/masterService';
import {
  ListErectionWorkService,
  GetErectionDetailService,
  extractRecordsArray,
  extractDetailObject,
  extractPaginationMeta,
  type PaginationMeta
} from '../../services/workService';
import type { ErectionRecord, ErectionNode, ListErectionPayload } from '../../models/workModels';
import './ErectionListing.css';
import './WorkDetails.css';

const breadcrumbs = [
  { label: 'Work Details' },
  { label: 'Erection Work' }
];

export const ErectionWorkPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [erections, setErections] = useState<ErectionRecord[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stateId, setStateId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [blockId, setBlockId] = useState<string>('');
  const [feeder, setFeeder] = useState<string>('');
  const [contractorId, setContractorId] = useState<string>('');
  const [lineType, setLineType] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [pageSize, setPageSize] = useState<number | null>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);

  // UI state for advanced filter drawer collapse
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState<boolean>(false);

  // Master Lists for dropdowns
  const [states, setStates] = useState<Array<{ id: number; state_name: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ id: number; district_name: string }>>([]);
  const [blocks, setBlocks] = useState<Array<{ id: number; block_name: string }>>([]);
  const [contractors, setContractors] = useState<Array<{ id: number; contractor_name: string }>>([]);

  // Server Pagination Metadata
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total_count: 0,
    total_pages: 1,
    current_page: 1,
    page_size: 10,
  });

  // Drawer details for Quick Inspect
  const [selectedErection, setSelectedErection] = useState<ErectionRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Load States and Contractors on mount
  useEffect(() => {
    ListStatesService({ is_active: true, page_size: 1000 } as any)
      .then((res: any) => {
        const list = res.data?.Data?.states || res.data?.states || extractRecordsArray(res);
        setStates(list || []);
      })
      .catch((e: any) => console.warn('Failed to load states:', e));

    ListContractorsService({ is_active: true, page_size: 1000 })
      .then((res: any) => {
        const list = res.data?.Data?.contractors || res.data?.contractors || extractRecordsArray(res);
        setContractors(list || []);
      })
      .catch((e: any) => console.warn('Failed to load contractors:', e));
  }, []);

  // When State changes -> load Districts
  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      setDistrictId('');
      setBlocks([]);
      setBlockId('');
      return;
    }
    ListDistrictsService({ state_id: Number(stateId), is_active: true, page_size: 1000 } as any)
      .then((res: any) => {
        const list = res.data?.Data?.districts || res.data?.districts || extractRecordsArray(res);
        setDistricts(list || []);
      })
      .catch((e: any) => console.warn('Failed to load districts:', e));
  }, [stateId]);

  // When District changes -> load Blocks
  useEffect(() => {
    if (!districtId) {
      setBlocks([]);
      setBlockId('');
      return;
    }
    ListBlocksService({ district_id: Number(districtId), is_active: true, page_size: 1000 } as any)
      .then((res: any) => {
        const list = res.data?.Data?.blocks || res.data?.blocks || extractRecordsArray(res);
        setBlocks(list || []);
      })
      .catch((e: any) => console.warn('Failed to load blocks:', e));
  }, [districtId]);

  // Fetch erection executions from API
  const fetchErections = useCallback(async (params: {
    targetPageIndex?: number;
    targetPageSize?: number | null;
    isRefresh?: boolean;
    overrideFilters?: Partial<{
      stateId: string;
      districtId: string;
      blockId: string;
      feeder: string;
      contractorId: string;
      lineType: string;
      status: string;
      startDate: string;
      endDate: string;
      searchQuery: string;
    }>;
  } = {}) => {
    try {
      if (params.isRefresh) setRefreshing(true);
      else setLoading(true);

      const curStateId = params.overrideFilters?.stateId !== undefined ? params.overrideFilters.stateId : stateId;
      const curDistrictId = params.overrideFilters?.districtId !== undefined ? params.overrideFilters.districtId : districtId;
      const curBlockId = params.overrideFilters?.blockId !== undefined ? params.overrideFilters.blockId : blockId;
      const curFeeder = params.overrideFilters?.feeder !== undefined ? params.overrideFilters.feeder : feeder;
      const curContractorId = params.overrideFilters?.contractorId !== undefined ? params.overrideFilters.contractorId : contractorId;
      const curLineType = params.overrideFilters?.lineType !== undefined ? params.overrideFilters.lineType : lineType;
      const curStatus = params.overrideFilters?.status !== undefined ? params.overrideFilters.status : status;
      const curStartDate = params.overrideFilters?.startDate !== undefined ? params.overrideFilters.startDate : startDate;
      const curEndDate = params.overrideFilters?.endDate !== undefined ? params.overrideFilters.endDate : endDate;
      const curSearch = params.overrideFilters?.searchQuery !== undefined ? params.overrideFilters.searchQuery : searchQuery;

      const curPageSize = params.targetPageSize !== undefined ? params.targetPageSize : pageSize;
      const curPageIndex = params.targetPageIndex !== undefined ? params.targetPageIndex : pageIndex;

      const payload: ListErectionPayload = {
        search: curSearch.trim() || undefined,
        state_id: curStateId ? Number(curStateId) : null,
        district_id: curDistrictId ? Number(curDistrictId) : null,
        block_id: curBlockId ? Number(curBlockId) : null,
        feeder: curFeeder.trim() || undefined,
        contractor_id: curContractorId ? Number(curContractorId) : null,
        line_type: curLineType ? Number(curLineType) : null,
        type_of_work: curLineType ? Number(curLineType) : null,
        status: curStatus !== 'all' ? Number(curStatus) : null,
        start_date: curStartDate || null,
        end_date: curEndDate || null,
        page_size: curPageSize === null ? null : curPageSize,
        page_index: curPageSize === null ? null : curPageIndex,
        all: curPageSize === null,
        is_admin: true,
      };

      const response = await ListErectionWorkService(payload);
      const list = extractRecordsArray<ErectionRecord>(response);
      setErections(list);

      const meta = extractPaginationMeta(response);
      setPaginationMeta(meta);

      if (params.isRefresh) {
        dispatch(addToast({ message: 'Erection records refreshed successfully', type: 'success' }));
      }
    } catch (err: any) {
      console.error('Failed to fetch erection executions:', err);
      setErections([]);
      dispatch(
        addToast({
          message: err?.response?.data?.Message || 'Failed to fetch erection listings',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    stateId, districtId, blockId, feeder, contractorId, lineType, status,
    startDate, endDate, searchQuery, pageSize, pageIndex, dispatch
  ]);

  useEffect(() => {
    fetchErections();
  }, []);

  // Filter actions
  const handleApplyFilters = () => {
    setPageIndex(1);
    fetchErections({ targetPageIndex: 1 });
  };

  const handleStatusSegmentChange = (newStatus: string) => {
    setStatus(newStatus);
    setPageIndex(1);
    fetchErections({
      targetPageIndex: 1,
      overrideFilters: { status: newStatus },
    });
  };

  const handleResetFilters = () => {
    setStateId('');
    setDistrictId('');
    setBlocks([]);
    setBlockId('');
    setFeeder('');
    setContractorId('');
    setLineType('');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setPageIndex(1);
    fetchErections({
      targetPageIndex: 1,
      overrideFilters: {
        stateId: '',
        districtId: '',
        blockId: '',
        feeder: '',
        contractorId: '',
        lineType: '',
        status: 'all',
        startDate: '',
        endDate: '',
        searchQuery: '',
      },
    });
  };

  const handleRemoveSingleFilter = (filterKey: string) => {
    const overrides: any = {};
    if (filterKey === 'search') {
      setSearchQuery('');
      overrides.searchQuery = '';
    } else if (filterKey === 'state') {
      setStateId('');
      setDistrictId('');
      setBlockId('');
      overrides.stateId = '';
      overrides.districtId = '';
      overrides.blockId = '';
    } else if (filterKey === 'district') {
      setDistrictId('');
      setBlockId('');
      overrides.districtId = '';
      overrides.blockId = '';
    } else if (filterKey === 'block') {
      setBlockId('');
      overrides.blockId = '';
    } else if (filterKey === 'feeder') {
      setFeeder('');
      overrides.feeder = '';
    } else if (filterKey === 'contractor') {
      setContractorId('');
      overrides.contractorId = '';
    } else if (filterKey === 'lineType') {
      setLineType('');
      overrides.lineType = '';
    } else if (filterKey === 'status') {
      setStatus('all');
      overrides.status = 'all';
    } else if (filterKey === 'dateRange') {
      setStartDate('');
      setEndDate('');
      overrides.startDate = '';
      overrides.endDate = '';
    }

    setPageIndex(1);
    fetchErections({
      targetPageIndex: 1,
      overrideFilters: overrides,
    });
  };

  const handlePageSizeChange = (newSize: number | null) => {
    setPageSize(newSize);
    setPageIndex(1);
    fetchErections({ targetPageSize: newSize, targetPageIndex: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > paginationMeta.total_pages) return;
    setPageIndex(newPage);
    fetchErections({ targetPageIndex: newPage });
  };

  // Detailed view handler
  const handleViewQuickDetails = async (record: ErectionRecord) => {
    setSelectedErection(record);
    setDrawerOpen(true);
    try {
      setLoadingDetail(true);
      const detailRes = await GetErectionDetailService(record.id);
      const detail = extractDetailObject<ErectionRecord>(detailRes);
      if (detail) {
        setSelectedErection(detail);
      }
    } catch (e) {
      console.warn('Could not fetch single erection detail, using summary:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCopyDrawingNo = (drawingNo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(drawingNo);
    dispatch(addToast({ message: `Copied ${drawingNo} to clipboard!`, type: 'info' }));
  };

  // Safe list of erections
  const safeErections = useMemo(() => {
    return Array.isArray(erections) ? erections : [];
  }, [erections]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (stateId) count++;
    if (districtId) count++;
    if (blockId) count++;
    if (feeder.trim()) count++;
    if (contractorId) count++;
    if (lineType) count++;
    if (status !== 'all') count++;
    if (startDate || endDate) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [stateId, districtId, blockId, feeder, contractorId, lineType, status, startDate, endDate, searchQuery]);

  // Selected names for filter tags
  const selectedStateName = useMemo(() => states.find(s => String(s.id) === stateId)?.state_name, [states, stateId]);
  const selectedDistrictName = useMemo(() => districts.find(d => String(d.id) === districtId)?.district_name, [districts, districtId]);
  const selectedBlockName = useMemo(() => blocks.find(b => String(b.id) === blockId)?.block_name, [blocks, blockId]);
  const selectedContractorName = useMemo(() => contractors.find(c => String(c.id) === contractorId)?.contractor_name, [contractors, contractorId]);

  // KPIs
  const totalExecutionsCount = paginationMeta.total_count || safeErections.length;
  const completedCount = safeErections.filter((e) => e.status === 2).length;
  const activeCount = safeErections.filter((e) => e.status === 1).length;
  const totalNodesCount = safeErections.reduce((acc, curr) => acc + (curr.nodes_count || (curr.nodes?.length || 0)), 0);
  const completionRate = totalExecutionsCount > 0 ? Math.round((completedCount / (completedCount + activeCount || 1)) * 100) : 0;

  // Table Columns
  const columns: DataColumn<ErectionRecord>[] = [
    {
      key: 'drawing_no',
      label: 'Drawing No / Execution Ref',
      sortable: true,
      width: '210px',
      render: (row) => (
        <div className="drawing-cell-wrapper">
          <div className="drawing-title-row">
            <span
              className="drawing-title-text"
              onClick={() => navigate(`/work-details/erection/${row.id}`)}
              title="Click to open execution details"
            >
              {row.drawing_no || `Erection #${row.id}`}
            </span>
            <button
              type="button"
              className="filter-search-clear"
              style={{ position: 'static' }}
              onClick={(e) => handleCopyDrawingNo(row.drawing_no || `Erection #${row.id}`, e)}
              title="Copy Drawing Number"
            >
              <Copy size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="drawing-id-pill">ID: #{row.id}</span>
            {row.type_of_work_name && (
              <span className="line-type-pill">{row.type_of_work_name}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'feeder_name',
      label: 'Feeder & DTR',
      sortable: true,
      width: '180px',
      render: (row) => (
        <div className="feeder-cell-wrapper">
          <div className="feeder-name-text">
            <Zap size={14} color="#0284c7" />
            <span>{row.feeder_name || 'Standard Feeder'}</span>
          </div>
          {row.dtr_code ? (
            <span className="dtr-tag-pill">DTR: {row.dtr_code}</span>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No DTR assigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'district_name',
      label: 'Geographical Scope',
      render: (row) => (
        <div className="geo-breadcrumb-cell">
          <div className="geo-district-bold">
            <MapPin size={13} color="var(--primary-color, #6366f1)" />
            <span>{row.district_name || 'District N/A'}</span>
          </div>
          <div className="geo-block-village-sub">
            {row.block_name ? `${row.block_name}` : ''}
            {row.village_name ? ` • ${row.village_name}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'contractor_name',
      label: 'Contractor & Surveyor',
      render: (row) => (
        <div className="contractor-cell-wrapper">
          <div className="contractor-name-bold">
            <Briefcase size={13} color="var(--text-secondary)" />
            <span>{row.contractor_name || 'Direct / N/A'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <User size={12} />
            <span>{row.surveyor_name || 'Unassigned Surveyor'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'nodes_count',
      label: 'Erected Nodes',
      sortable: true,
      width: '140px',
      render: (row) => {
        const count = row.nodes_count || (row.nodes?.length || 0);
        return (
          <span className={`nodes-counter-cell-badge ${count === 0 ? 'empty' : ''}`}>
            <Layers size={13} />
            <span>{count} {count === 1 ? 'Node' : 'Nodes'}</span>
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '130px',
      render: (row) => (
        <Chips type={row.status === 2 ? 'success' : 'warning'}>
          {row.status === 2 ? 'Completed' : 'In Progress'}
        </Chips>
      ),
    },
    {
      key: 'created_on',
      label: 'Execution Date',
      sortable: true,
      width: '140px',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          <Calendar size={13} color="var(--text-muted)" />
          <span>{row.created_on || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '160px',
      render: (row) => (
        <div className="table-actions-cell">
          <button
            type="button"
            className="action-inspect-btn"
            onClick={() => handleViewQuickDetails(row)}
            title="Quick Inspect Nodes & Specifications"
          >
            <Eye size={13} />
            <span>Inspect</span>
          </button>
          <button
            type="button"
            className="action-full-view-btn"
            onClick={() => navigate(`/work-details/erection/${row.id}`)}
            title="Open Full Execution Page"
          >
            <span>View</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      <div className="erection-page-wrapper">
        {/* 1. Page Header & Actions Banner */}
        <div className="erection-header-banner">
          <div className="erection-header-title-group">
            <div className="erection-header-badge-row">
              <span className="erection-live-sync-pill">
                <span className="sync-pulsing-dot" />
                Live GIS Erection Records
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {totalExecutionsCount} Total Drawings Tracked
              </span>
            </div>
            <h1 className="erection-header-title">
              <Hammer size={24} color="#0284c7" />
              Erection Work Details
            </h1>
            <p className="erection-header-sub">
              Monitor real-time field erection executions, physical pole installation, transformers, and conductor progress
            </p>
          </div>

          <div className="erection-header-actions">
            <button
              type="button"
              className="header-action-btn-secondary"
              onClick={() => fetchErections({ isRefresh: true })}
              disabled={loading || refreshing}
              title="Refresh Records"
            >
              <RefreshCw size={15} className={refreshing ? 'icon-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 2. Executive KPI Metrics Cards Grid (Compact, Low Height) */}
        <div className="erection-kpi-grid">
          {/* KPI 1: Total Erections */}
          <div className="erection-kpi-card blue">
            <div className="kpi-main-group">
              <div className="kpi-icon-circle blue">
                <Hammer size={18} />
              </div>
              <div className="kpi-content">
                <span className="kpi-metric-val">{totalExecutionsCount}</span>
                <span className="kpi-metric-label">Total Erections</span>
              </div>
            </div>
            <span className="kpi-trend-pill blue">
              <Activity size={11} /> Live
            </span>
          </div>

          {/* KPI 2: Active / In-Progress */}
          <div className="erection-kpi-card amber">
            <div className="kpi-main-group">
              <div className="kpi-icon-circle amber">
                <Clock size={18} />
              </div>
              <div className="kpi-content">
                <span className="kpi-metric-val">{activeCount}</span>
                <span className="kpi-metric-label">In-Progress</span>
              </div>
            </div>
            <span className="kpi-trend-pill amber">In Field</span>
          </div>

          {/* KPI 3: Completed Works */}
          <div className="erection-kpi-card green">
            <div className="kpi-main-group">
              <div className="kpi-icon-circle green">
                <CheckCircle2 size={18} />
              </div>
              <div className="kpi-content">
                <span className="kpi-metric-val">{completedCount}</span>
                <span className="kpi-metric-label">Completed</span>
              </div>
            </div>
            <span className="kpi-trend-pill green">
              {completionRate}% Done
            </span>
          </div>

          {/* KPI 4: Structures & Nodes */}
          <div className="erection-kpi-card purple">
            <div className="kpi-main-group">
              <div className="kpi-icon-circle purple">
                <Layers size={18} />
              </div>
              <div className="kpi-content">
                <span className="kpi-metric-val">{totalNodesCount}</span>
                <span className="kpi-metric-label">Nodes & Poles</span>
              </div>
            </div>
            <span className="kpi-trend-pill purple">
              <Layers3 size={11} /> Assets
            </span>
          </div>
        </div>

        {/* 3. Dual-Tier Filter Toolbar */}
        <div className="erection-filter-container">
          {/* Primary Fast Filter Bar */}
          <div className="filter-primary-bar">
            <div className="filter-left-controls">
              {/* Universal Search */}
              <div className="filter-search-box">
                <Search size={16} className="filter-search-icon" />
                <input
                  type="text"
                  className="filter-search-input"
                  placeholder="Search Drawing No, Feeder, DTR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="filter-search-clear"
                    onClick={() => handleRemoveSingleFilter('search')}
                    title="Clear Search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Segment Pills */}
              <div className="status-pill-group">
                <button
                  type="button"
                  className={`status-segment-btn ${status === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusSegmentChange('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`status-segment-btn ${status === '1' ? 'active' : ''}`}
                  onClick={() => handleStatusSegmentChange('1')}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`status-segment-btn ${status === '2' ? 'active' : ''}`}
                  onClick={() => handleStatusSegmentChange('2')}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="filter-right-controls">
              <button
                type="button"
                className={`filter-toggle-btn ${activeFiltersCount > 0 ? 'has-active' : ''}`}
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                title="Toggle Advanced Filter Panel"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-count-badge">{activeFiltersCount}</span>
                )}
                {isAdvancedFiltersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <button
                type="button"
                className="filter-apply-action-btn"
                onClick={handleApplyFilters}
                title="Apply Filter Selections"
              >
                <Check size={14} />
                <span>Apply</span>
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  className="filter-reset-action-btn"
                  onClick={handleResetFilters}
                  title="Reset All Filters"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary Expandable Advanced Filter Panel */}
          {isAdvancedFiltersOpen && (
            <div className="filter-advanced-panel">
              <div className="filter-groups-layout">
                {/* Section A: Geographical Scope */}
                <div className="filter-section-card">
                  <div className="filter-section-title">
                    <MapPin size={14} color="#0284c7" />
                    Geographical Scope
                  </div>
                  <div className="filter-inputs-row">
                    <div className="filter-input-group">
                      <label className="filter-label">State</label>
                      <select
                        className="filter-select"
                        value={stateId}
                        onChange={(e) => setStateId(e.target.value)}
                      >
                        <option value="">All States</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.id}>{s.state_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-input-group">
                      <label className="filter-label">District</label>
                      <select
                        className="filter-select"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                        disabled={!stateId}
                      >
                        <option value="">{stateId ? 'All Districts' : 'Select State First'}</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>{d.district_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-input-group">
                      <label className="filter-label">Block</label>
                      <select
                        className="filter-select"
                        value={blockId}
                        onChange={(e) => setBlockId(e.target.value)}
                        disabled={!districtId}
                      >
                        <option value="">{districtId ? 'All Blocks' : 'Select District First'}</option>
                        {blocks.map((b) => (
                          <option key={b.id} value={b.id}>{b.block_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section B: Line & Contractor Classification */}
                <div className="filter-section-card">
                  <div className="filter-section-title">
                    <Zap size={14} color="#f59e0b" />
                    Line & Contractor
                  </div>
                  <div className="filter-inputs-row">
                    <div className="filter-input-group">
                      <label className="filter-label">Feeder Name</label>
                      <input
                        type="text"
                        className="filter-text-field"
                        placeholder="e.g. Feeder-01..."
                        value={feeder}
                        onChange={(e) => setFeeder(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                      />
                    </div>

                    <div className="filter-input-group">
                      <label className="filter-label">Contractor</label>
                      <select
                        className="filter-select"
                        value={contractorId}
                        onChange={(e) => setContractorId(e.target.value)}
                      >
                        <option value="">All Contractors</option>
                        {contractors.map((c) => (
                          <option key={c.id} value={c.id}>{c.contractor_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-input-group">
                      <label className="filter-label">Line Type</label>
                      <select
                        className="filter-select"
                        value={lineType}
                        onChange={(e) => setLineType(e.target.value)}
                      >
                        <option value="">All Line Types</option>
                        <option value="1">11 KV Overhead Line</option>
                        <option value="2">LT Overhead Line</option>
                        <option value="3">33 KV High Tension Line</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section C: Execution Date Range */}
                <div className="filter-section-card">
                  <div className="filter-section-title">
                    <Calendar size={14} color="#10b981" />
                    Execution Date Range
                  </div>
                  <div className="filter-inputs-row">
                    <div className="filter-input-group">
                      <label className="filter-label">From Date</label>
                      <input
                        type="date"
                        className="filter-date-field"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="filter-input-group">
                      <label className="filter-label">To Date</label>
                      <input
                        type="date"
                        className="filter-date-field"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips Tray */}
          {activeFiltersCount > 0 && (
            <div className="active-filters-tray">
              <span className="active-filter-label">
                <Filter size={13} color="var(--primary-color, #6366f1)" />
                Active Filters:
              </span>

              {searchQuery.trim() && (
                <span className="active-tag-chip">
                  Search: <strong>"{searchQuery}"</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('search')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {status !== 'all' && (
                <span className="active-tag-chip">
                  Status: <strong>{status === '2' ? 'Completed' : 'In Progress'}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('status')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {stateId && selectedStateName && (
                <span className="active-tag-chip">
                  State: <strong>{selectedStateName}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('state')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {districtId && selectedDistrictName && (
                <span className="active-tag-chip">
                  District: <strong>{selectedDistrictName}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('district')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {blockId && selectedBlockName && (
                <span className="active-tag-chip">
                  Block: <strong>{selectedBlockName}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('block')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {feeder.trim() && (
                <span className="active-tag-chip">
                  Feeder: <strong>{feeder}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('feeder')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {contractorId && selectedContractorName && (
                <span className="active-tag-chip">
                  Contractor: <strong>{selectedContractorName}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('contractor')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {lineType && (
                <span className="active-tag-chip">
                  Line Type: <strong>{lineType === '1' ? '11 KV' : lineType === '2' ? 'LT' : '33 KV'}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('lineType')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {(startDate || endDate) && (
                <span className="active-tag-chip">
                  Date: <strong>{startDate || 'Any'} to {endDate || 'Any'}</strong>
                  <button type="button" className="tag-remove-btn" onClick={() => handleRemoveSingleFilter('dateRange')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              <button type="button" className="clear-all-link" onClick={handleResetFilters}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* 4. Table and Empty States */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <Loader size={36} />
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
              Loading Erection Work Executions from GIS server...
            </p>
          </div>
        ) : safeErections.length === 0 ? (
          <div className="erection-empty-state">
            <div className="empty-state-icon-box">
              <AlertCircle size={28} />
            </div>
            <h3 className="empty-state-title">No Erection Records Found</h3>
            <p className="empty-state-desc">
              {activeFiltersCount > 0
                ? 'No erection executions match your current filter criteria. Try resetting filters or adjusting search parameters.'
                : 'No erection execution records have been uploaded or submitted yet.'}
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="secondary"
                style={{ marginTop: '8px' }}
                onClick={handleResetFilters}
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="table-card-wrapper">
            <DataTable<ErectionRecord>
              columns={columns}
              data={safeErections}
              hideFooter={true}
              hideSearch={true}
            />

            {/* 5. Server-Side Pagination Bar */}
            <div className="erection-pagination-bar">
              <div className="pagination-left-info">
                <span className="pagination-count-summary">
                  {pageSize === null ? (
                    <>Showing all <strong>{paginationMeta.total_count}</strong> records (Unpaged)</>
                  ) : (
                    <>
                      Showing <strong>{paginationMeta.total_count === 0 ? 0 : (pageIndex - 1) * pageSize + 1}</strong> -{' '}
                      <strong>{Math.min(pageIndex * pageSize, paginationMeta.total_count)}</strong> of{' '}
                      <strong>{paginationMeta.total_count}</strong> records
                    </>
                  )}
                </span>

                <div className="pagination-size-selector">
                  <label htmlFor="erection-pagesize">Rows:</label>
                  <select
                    id="erection-pagesize"
                    className="pagination-select-control"
                    value={pageSize === null ? 'all' : pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value === 'all' ? null : Number(e.target.value))}
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              {pageSize !== null && paginationMeta.total_pages > 1 && (
                <div className="pagination-nav-buttons">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={pageIndex <= 1}
                    title="First Page"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex <= 1}
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '0 8px', fontWeight: 600 }}>
                    Page <strong style={{ color: 'var(--text-primary)' }}>{pageIndex}</strong> of {paginationMeta.total_pages}
                  </span>

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex >= paginationMeta.total_pages}
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => handlePageChange(paginationMeta.total_pages)}
                    disabled={pageIndex >= paginationMeta.total_pages}
                    title="Last Page"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. Quick-Inspect Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedErection(null);
          }}
          title={selectedErection ? `Erection Quick Inspection: ${selectedErection.drawing_no || `#${selectedErection.id}`}` : 'Erection Inspection'}
          maxWidth="680px"
          footer={
            selectedErection && (
              <div className="drawer-action-footer-btns">
                <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                  Close Inspection
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(`/work-details/erection/${selectedErection.id}`);
                  }}
                >
                  <span>Open Full Execution Page</span>
                  <ExternalLink size={14} />
                </Button>
              </div>
            )
          }
        >
          {selectedErection && (
            <div className="drawer-inspect-container">
              {loadingDetail && (
                <div style={{ color: '#0284c7', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={13} className="icon-spin" />
                  <span>Loading full node details from GIS database...</span>
                </div>
              )}

              {/* Drawer Hero Summary */}
              <div className="drawer-summary-hero">
                <div className="drawer-hero-top">
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8' }}>
                      Execution ID: #{selectedErection.id}
                    </span>
                    <h3 className="drawer-dwg-title">
                      {selectedErection.drawing_no || `Drawing #${selectedErection.id}`}
                    </h3>
                  </div>
                  <Chips type={selectedErection.status === 2 ? 'success' : 'warning'}>
                    {selectedErection.status === 2 ? 'Completed' : 'In Progress'}
                  </Chips>
                </div>

                <div className="drawer-hero-meta-row">
                  <span>Feeder: <strong>{selectedErection.feeder_name || 'Standard'}</strong></span>
                  {selectedErection.dtr_code && (
                    <span>DTR: <strong>{selectedErection.dtr_code}</strong></span>
                  )}
                  <span>Date: <strong>{selectedErection.created_on || 'N/A'}</strong></span>
                </div>
              </div>

              {/* Key Overview Properties */}
              <div className="drawer-card-section">
                <div className="drawer-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={15} color="#0284c7" />
                    <span>Administrative Overview</span>
                  </div>
                </div>
                <div className="drawer-props-grid">
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Contractor</span>
                    <span className="drawer-prop-value">{selectedErection.contractor_name || 'N/A'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Surveyor</span>
                    <span className="drawer-prop-value">{selectedErection.surveyor_name || 'Unassigned'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Type of Work</span>
                    <span className="drawer-prop-value">{selectedErection.type_of_work_name || 'Standard Erection'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Starting Point</span>
                    <span className="drawer-prop-value">{selectedErection.lt_starting_point_name || 'Default Source'}</span>
                  </div>
                </div>
              </div>

              {/* Geographical Coordinates Hierarchy */}
              <div className="drawer-card-section">
                <div className="drawer-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#10b981" />
                    <span>Geographical Coordinates</span>
                  </div>
                </div>
                <div className="drawer-props-grid">
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">State</span>
                    <span className="drawer-prop-value">{selectedErection.state_name || 'N/A'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">District</span>
                    <span className="drawer-prop-value">{selectedErection.district_name || 'N/A'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Block</span>
                    <span className="drawer-prop-value">{selectedErection.block_name || 'N/A'}</span>
                  </div>
                  <div className="drawer-prop-item">
                    <span className="drawer-prop-label">Village</span>
                    <span className="drawer-prop-value">{selectedErection.village_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedErection.remarks && (
                <div className="drawer-card-section">
                  <div className="drawer-card-header">
                    <span>Field Surveyor Remarks</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '6px' }}>
                    {selectedErection.remarks}
                  </p>
                </div>
              )}

              {/* Erected Structure Nodes */}
              <div className="drawer-card-section">
                <div className="drawer-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={15} color="#f59e0b" />
                    <span>Erected Structures & Nodes ({selectedErection.nodes?.length || 0})</span>
                  </div>
                </div>

                {!selectedErection.nodes || selectedErection.nodes.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px 0' }}>
                    No structure nodes recorded for this erection execution yet.
                  </p>
                ) : (
                  <div>
                    {selectedErection.nodes.map((node: ErectionNode) => (
                      <div key={node.id || node.sequenceNumber} className="drawer-node-card">
                        <div className="drawer-node-top">
                          <div className="drawer-node-tag-seq">
                            <span className="node-seq-dot">{node.sequenceNumber}</span>
                            <span>{node.nameLabel}</span>
                          </div>
                          <span className={`line-type-pill`} style={{ fontSize: '11px' }}>
                            {node.nodeType}
                          </span>
                        </div>

                        {/* GPS Coordinates */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          <MapPin size={12} color="#0284c7" />
                          <span>Lat: {node.latitude?.toFixed(5)}, Long: {node.longitude?.toFixed(5)}</span>
                        </div>

                        {/* Hardware Details */}
                        <div className="drawer-props-grid" style={{ marginTop: '4px' }}>
                          {node.pole_type_name && (
                            <div className="drawer-prop-item">
                              <span className="drawer-prop-label">Pole Type</span>
                              <span className="drawer-prop-value">{node.pole_type_name} {node.pole_qty ? `(${node.pole_qty})` : ''}</span>
                            </div>
                          )}
                          {node.dtr_capacity_name && (
                            <div className="drawer-prop-item">
                              <span className="drawer-prop-label">DTR Capacity</span>
                              <span className="drawer-prop-value">{node.dtr_capacity_name}</span>
                            </div>
                          )}
                          {node.conductor_name && (
                            <div className="drawer-prop-item">
                              <span className="drawer-prop-label">Conductor</span>
                              <span className="drawer-prop-value">{node.conductor_name}</span>
                            </div>
                          )}
                          {node.structure_condition && (
                            <div className="drawer-prop-item">
                              <span className="drawer-prop-label">Condition</span>
                              <span className="drawer-prop-value">{node.structure_condition}</span>
                            </div>
                          )}
                        </div>

                        {/* Attribute Badges */}
                        <div className="drawer-node-badges" style={{ marginTop: '4px' }}>
                          {node.earthing_quantity ? (
                            <span className="drawing-id-pill">Earthing: {node.earthing_quantity}</span>
                          ) : null}
                          {node.stay_set_quantity ? (
                            <span className="drawing-id-pill">Stay Set: {node.stay_set_quantity}</span>
                          ) : null}
                          {node.dead_end_clamp_qty ? (
                            <span className="drawing-id-pill">Dead End Clamps: {node.dead_end_clamp_qty}</span>
                          ) : null}
                          {node.suspension_clamp_qty ? (
                            <span className="drawing-id-pill">Suspension Clamps: {node.suspension_clamp_qty}</span>
                          ) : null}
                          {node.ipc_qty ? (
                            <span className="drawing-id-pill">IPC: {node.ipc_qty}</span>
                          ) : null}
                          {node.service_connection_qty ? (
                            <span className="drawing-id-pill">Service Conn: {node.service_connection_qty}</span>
                          ) : null}
                          {node.extra_consumption ? (
                            <span className="drawing-id-pill">Extra: {node.extra_consumption}m</span>
                          ) : null}
                        </div>

                        {/* Node Thumbnails */}
                        {((node.images && node.images.length > 0) || node.imageUri) && (
                          <div className="drawer-node-thumb-tray">
                            {(node.images || (node.imageUri ? [node.imageUri] : [])).map((imgUrl, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt={`Structure node ${node.nameLabel}`}
                                className="drawer-thumb-img"
                                onClick={() => window.open(imgUrl, '_blank')}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </MainLayout>
  );
};

export default ErectionWorkPage;
