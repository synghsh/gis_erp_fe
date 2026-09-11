import React, { useState, useEffect, useMemo } from 'react';
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
  Building2,
  Briefcase
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

  // 10 Filter States
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

  // Drawer details
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

  // Fetch erection executions from API with all 10 filters & pagination
  const fetchErections = async (params: {
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
        dispatch(addToast({ message: 'Erection listings refreshed successfully', type: 'success' }));
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
  };

  useEffect(() => {
    fetchErections();
  }, []);

  // Filter actions
  const handleApplyFilters = () => {
    setPageIndex(1);
    fetchErections({ targetPageIndex: 1 });
  };

  const handleResetFilters = () => {
    setStateId('');
    setDistrictId('');
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
  const handleViewDetails = async (record: ErectionRecord) => {
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

  // Safe list of erections
  const safeErections = useMemo(() => {
    return Array.isArray(erections) ? erections : [];
  }, [erections]);

  // Active filters count badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (stateId) count++;
    if (districtId) count++;
    if (blockId) count++;
    if (feeder.trim()) count++;
    if (contractorId) count++;
    if (lineType) count++;
    if (status !== 'all') count++;
    if (startDate) count++;
    if (endDate) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [stateId, districtId, blockId, feeder, contractorId, lineType, status, startDate, endDate, searchQuery]);

  // KPIs based on total records
  const totalExecutionsCount = paginationMeta.total_count || safeErections.length;
  const completedCount = safeErections.filter((e) => e.status === 2).length;
  const activeCount = safeErections.filter((e) => e.status === 1).length;
  const totalNodesCount = safeErections.reduce((acc, curr) => acc + (curr.nodes_count || (curr.nodes?.length || 0)), 0);

  // Table Columns
  const columns: DataColumn<ErectionRecord>[] = [
    {
      key: 'drawing_no',
      label: 'Drawing No / Ref',
      sortable: true,
      width: '180px',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {row.drawing_no || `Erection #${row.id}`}
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            ID: #{row.id}
          </span>
        </div>
      ),
    },
    {
      key: 'feeder_name',
      label: 'Feeder / DTR',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
            {row.feeder_name || 'Standard Feeder'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {row.dtr_code ? `DTR: ${row.dtr_code}` : 'No DTR code'}
          </div>
        </div>
      ),
    },
    {
      key: 'district_name',
      label: 'Location Details',
      render: (row) => (
        <div style={{ fontSize: '12.5px' }}>
          <span style={{ color: 'var(--text-primary)' }}>
            {row.district_name || 'Dist. N/A'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {row.block_name ? ` • ${row.block_name}` : ''}
            {row.village_name ? ` • ${row.village_name}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'contractor_name',
      label: 'Contractor & Type',
      render: (row) => (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {row.contractor_name || 'N/A'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            {row.type_of_work_name || 'Standard Erection'}
          </div>
        </div>
      ),
    },
    {
      key: 'surveyor_name',
      label: 'Field Surveyor',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {row.surveyor_name || 'Assigned Surveyor'}
          </span>
        </div>
      ),
    },
    {
      key: 'nodes_count',
      label: 'Erected Nodes',
      sortable: true,
      width: '130px',
      render: (row) => {
        const count = row.nodes_count || (row.nodes?.length || 0);
        return (
          <span className="nodes-counter-badge">
            <Zap size={13} color="#f59e0b" />
            {count} {count === 1 ? 'Node' : 'Nodes'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
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
      width: '150px',
      render: (row) => (
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          {row.created_on || 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '110px',
      render: (row) => (
        <button
          type="button"
          className="header-action-btn"
          style={{ width: 'auto', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', borderRadius: '6px' }}
          onClick={() => navigate(`/work-details/erection/${row.id}`)}
          title="View Full Erection Execution Details"
          aria-label="View Details"
        >
          <Eye size={15} />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>View</span>
        </button>
      ),
    },
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      <div className="work-page-container">
        {/* Page Header */}
        <div className="page-header-container">
          <div>
            <h2 className="page-header-title">Erection Work Details</h2>
            <p className="page-header-sub">
              Track real-time electrical erection executions, installed pole nodes, and structures
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`refresh-action-btn ${refreshing ? 'spinning' : ''}`}
              onClick={() => fetchErections(true)}
              disabled={loading || refreshing}
            >
              <RefreshCw size={15} />
              {refreshing ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="work-stats-grid">
          <div className="work-stat-card">
            <div className="stat-icon-wrapper blue">
              <Hammer size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalExecutionsCount}</span>
              <span className="stat-label">Total Erections</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper amber">
              <Clock size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">In Progress / Active</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed Works</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper purple">
              <Layers size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalNodesCount}</span>
              <span className="stat-label">Structures & Nodes</span>
            </div>
          </div>
        </div>

        {/* 10-Filter Advanced Filter Panel */}
        <div className="work-advanced-filters">
          <div className="filters-header">
            <div className="filters-title-group">
              <span className="filters-heading">
                <Filter size={16} color="var(--accent-primary)" />
                Work Details Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className="active-filters-badge">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>

            <div className="filters-actions-group">
              <button className="filter-apply-btn" onClick={handleApplyFilters} title="Apply selected filters">
                <Check size={15} /> Apply Filters
              </button>
              <button className="filter-reset-btn" onClick={handleResetFilters} title="Reset all filters">
                <RotateCcw size={14} /> Reset
              </button>
              <button
                className="refresh-action-btn"
                onClick={() => fetchErections({ isRefresh: true })}
                disabled={refreshing || loading}
                title="Refresh Records"
              >
                <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
              </button>
            </div>
          </div>

          <div className="filter-fields-grid">
            {/* i. State */}
            <div className="filter-field-item">
              <label className="filter-field-label">i. State</label>
              <select
                className="filter-control-select"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.state_name}</option>
                ))}
              </select>
            </div>

            {/* ii. District */}
            <div className="filter-field-item">
              <label className="filter-field-label">ii. District</label>
              <select
                className="filter-control-select"
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

            {/* iii. Block */}
            <div className="filter-field-item">
              <label className="filter-field-label">iii. Block</label>
              <select
                className="filter-control-select"
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

            {/* iv. Feeder */}
            <div className="filter-field-item">
              <label className="filter-field-label">iv. Feeder</label>
              <input
                type="text"
                className="filter-control-input"
                placeholder="Feeder name..."
                value={feeder}
                onChange={(e) => setFeeder(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>

            {/* v. Contractor Name */}
            <div className="filter-field-item">
              <label className="filter-field-label">v. Contractor Name</label>
              <select
                className="filter-control-select"
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
              >
                <option value="">All Contractors</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>{c.contractor_name}</option>
                ))}
              </select>
            </div>

            {/* vi. Line Type */}
            <div className="filter-field-item">
              <label className="filter-field-label">vi. Line Type</label>
              <select
                className="filter-control-select"
                value={lineType}
                onChange={(e) => setLineType(e.target.value)}
              >
                <option value="">All Line Types</option>
                <option value="1">11 KV Overhead Line</option>
                <option value="2">LT Overhead Line</option>
                <option value="3">33 KV High Tension Line</option>
              </select>
            </div>

            {/* vii. Status */}
            <div className="filter-field-item">
              <label className="filter-field-label">vii. Status</label>
              <select
                className="filter-control-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="1">Active / In Progress</option>
                <option value="2">Completed</option>
              </select>
            </div>

            {/* viii. Start Date */}
            <div className="filter-field-item">
              <label className="filter-field-label">viii. Start Date</label>
              <input
                type="date"
                className="filter-control-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* viii. End Date */}
            <div className="filter-field-item">
              <label className="filter-field-label">viii. End Date</label>
              <input
                type="date"
                className="filter-control-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Search Keyword */}
            <div className="filter-field-item">
              <label className="filter-field-label">Search / Drawing</label>
              <input
                type="text"
                className="filter-control-input"
                placeholder="Drawing No, DTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
          </div>
        </div>

        {/* Main Content: Table or Loading */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <Loader size={36} />
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
              Loading Erection Work Executions from API...
            </p>
          </div>
        ) : safeErections.length === 0 ? (
          <div className="glass-panel work-empty-state">
            <div className="work-empty-icon">
              <AlertCircle size={28} />
            </div>
            <h3 className="work-empty-title">No Erection Records Found</h3>
            <p className="work-empty-subtitle">
              {activeFiltersCount > 0
                ? 'No erection executions match your filter criteria. Try resetting filters.'
                : 'No erection execution records have been submitted yet.'}
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="secondary"
                style={{ marginTop: '16px' }}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <DataTable<ErectionRecord>
              columns={columns}
              data={safeErections}
              hideFooter={true}
              hideSearch={true}
            />

            {/* ix & x. Dynamic Pagination Controls */}
            <div className="work-pagination-bar">
              <div className="pagination-info-side">
                <span className="pagination-count-label">
                  {pageSize === null ? (
                    <>
                      Showing all <span className="pagination-count-highlight">{paginationMeta.total_count}</span> records (All Data)
                    </>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="pagination-count-highlight">
                        {paginationMeta.total_count === 0 ? 0 : (pageIndex - 1) * pageSize + 1}
                      </span>
                      {' '}-{' '}
                      <span className="pagination-count-highlight">
                        {Math.min(pageIndex * pageSize, paginationMeta.total_count)}
                      </span>
                      {' '}of{' '}
                      <span className="pagination-count-highlight">{paginationMeta.total_count}</span> records
                    </>
                  )}
                </span>

                <div className="pagination-pagesize-wrapper">
                  <label htmlFor="erection-pagesize">ix. Page Size:</label>
                  <select
                    id="erection-pagesize"
                    className="pagination-pagesize-select"
                    value={pageSize === null ? 'all' : pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value === 'all' ? null : Number(e.target.value))}
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                    <option value="all">All (No Pagination)</option>
                  </select>
                </div>
              </div>

              {pageSize !== null && paginationMeta.total_pages > 1 && (
                <div className="pagination-nav-group">
                  <button
                    className="pagination-page-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={pageIndex <= 1}
                    title="First Page"
                  >
                    First
                  </button>
                  <button
                    className="pagination-page-btn"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex <= 1}
                    title="Previous Page"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '0 8px' }}>
                    x. Page <strong style={{ color: 'var(--text-primary)' }}>{pageIndex}</strong> of {paginationMeta.total_pages}
                  </span>

                  <button
                    className="pagination-page-btn"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex >= paginationMeta.total_pages}
                    title="Next Page"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <button
                    className="pagination-page-btn"
                    onClick={() => handlePageChange(paginationMeta.total_pages)}
                    disabled={pageIndex >= paginationMeta.total_pages}
                    title="Last Page"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Erection & Node Inspection Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedErection(null);
          }}
          title={selectedErection ? `Erection Execution: ${selectedErection.drawing_no || `#${selectedErection.id}`}` : 'Erection Details'}
          maxWidth="640px"
          footer={
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Close Inspection
            </Button>
          }
        >
          {selectedErection && (
            <div>
              {loadingDetail && (
                <div style={{ marginBottom: '14px', color: 'var(--accent-primary)', fontSize: '13px' }}>
                  Refreshing latest node attributes...
                </div>
              )}

              {/* Execution Summary Section */}
              <div className="drawer-detail-section">
                <div className="drawer-section-title">
                  <Tag size={16} /> Execution Overview
                </div>
                <div className="detail-properties-grid">
                  <div className="detail-property-card">
                    <div className="prop-label">Drawing Number</div>
                    <div className="prop-val">{selectedErection.drawing_no || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Status</div>
                    <div className="prop-val">
                      <Chips type={selectedErection.status === 2 ? 'success' : 'warning'}>
                        {selectedErection.status === 2 ? 'Completed' : 'Active'}
                      </Chips>
                    </div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Feeder Name</div>
                    <div className="prop-val">{selectedErection.feeder_name || 'Standard Feeder'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">DTR Code</div>
                    <div className="prop-val">{selectedErection.dtr_code || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Contractor</div>
                    <div className="prop-val">{selectedErection.contractor_name || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Surveyor</div>
                    <div className="prop-val">{selectedErection.surveyor_name || 'Unassigned'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Type of Work</div>
                    <div className="prop-val">{selectedErection.type_of_work_name || 'Standard Erection'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Execution Date</div>
                    <div className="prop-val">{selectedErection.created_on || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="drawer-detail-section">
                <div className="drawer-section-title">
                  <MapPin size={16} /> Geographical Location
                </div>
                <div className="detail-properties-grid">
                  <div className="detail-property-card">
                    <div className="prop-label">State</div>
                    <div className="prop-val">{selectedErection.state_name || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">District</div>
                    <div className="prop-val">{selectedErection.district_name || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Block</div>
                    <div className="prop-val">{selectedErection.block_name || 'N/A'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Village</div>
                    <div className="prop-val">{selectedErection.village_name || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Remarks if any */}
              {selectedErection.remarks && (
                <div className="drawer-detail-section">
                  <div className="drawer-section-title">
                    <Calendar size={16} /> Field Remarks
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {selectedErection.remarks}
                  </p>
                </div>
              )}

              {/* Erected Nodes / Structures */}
              <div className="drawer-detail-section">
                <div className="drawer-section-title">
                  <Zap size={16} /> Erected Nodes & Structures ({selectedErection.nodes?.length || 0})
                </div>

                {!selectedErection.nodes || selectedErection.nodes.length === 0 ? (
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    No structure nodes recorded for this erection execution yet.
                  </p>
                ) : (
                  <div className="nodes-timeline-list">
                    {selectedErection.nodes.map((node: ErectionNode) => (
                      <div key={node.id || node.sequenceNumber} className="node-timeline-card">
                        <div className="node-card-header">
                          <div className="node-header-left">
                            <span className="node-seq-badge">{node.sequenceNumber}</span>
                            <span className="node-nameLabel">{node.nameLabel}</span>
                          </div>
                          <span className={`node-type-badge ${String(node.nodeType).toLowerCase()}`}>
                            {node.nodeType}
                          </span>
                        </div>

                        {/* Coordinates */}
                        <div className="node-gps-coordinates">
                          <MapPin size={13} color="var(--accent-primary)" />
                          <span>Lat: {node.latitude?.toFixed(6)}, Long: {node.longitude?.toFixed(6)}</span>
                        </div>

                        {/* Specific Hardware Info */}
                        <div className="detail-properties-grid" style={{ marginBottom: '10px' }}>
                          {node.pole_type_name && (
                            <div className="detail-property-card">
                              <div className="prop-label">Pole Type & Qty</div>
                              <div className="prop-val">{node.pole_type_name} {node.pole_qty ? `(${node.pole_qty})` : ''}</div>
                            </div>
                          )}
                          {node.dtr_capacity_name && (
                            <div className="detail-property-card">
                              <div className="prop-label">DTR Capacity</div>
                              <div className="prop-val">{node.dtr_capacity_name} {node.dtr_serial_no ? `(S/N: ${node.dtr_serial_no})` : ''}</div>
                            </div>
                          )}
                          {node.conductor_name && (
                            <div className="detail-property-card">
                              <div className="prop-label">Conductor</div>
                              <div className="prop-val">{node.conductor_name}</div>
                            </div>
                          )}
                          {node.structure_condition && (
                            <div className="detail-property-card">
                              <div className="prop-label">Condition</div>
                              <div className="prop-val">{node.structure_condition}</div>
                            </div>
                          )}
                        </div>

                        {/* Earthing, Stay sets, Clamps attributes */}
                        <div className="node-attributes-tags">
                          {node.earthing_quantity ? (
                            <span className="attr-tag">Earthing: {node.earthing_quantity}</span>
                          ) : null}
                          {node.stay_set_quantity ? (
                            <span className="attr-tag">Stay Set: {node.stay_set_quantity}</span>
                          ) : null}
                          {node.dead_end_clamp_qty ? (
                            <span className="attr-tag">Dead End Clamp: {node.dead_end_clamp_qty}</span>
                          ) : null}
                          {node.suspension_clamp_qty ? (
                            <span className="attr-tag">Suspension Clamp: {node.suspension_clamp_qty}</span>
                          ) : null}
                          {node.ipc_qty ? (
                            <span className="attr-tag">IPC: {node.ipc_qty}</span>
                          ) : null}
                          {node.service_connection_qty ? (
                            <span className="attr-tag">Service Conn: {node.service_connection_qty}</span>
                          ) : null}
                          {node.extra_consumption ? (
                            <span className="attr-tag">Extra: {node.extra_consumption}m</span>
                          ) : null}
                          {node.attributes &&
                            Object.entries(node.attributes)
                              .filter(([k, v]) => v !== null && v !== undefined && v !== '' && typeof v !== 'object')
                              .slice(0, 6)
                              .map(([k, v]) => (
                                <span key={k} className="attr-tag">
                                  {k}: {String(v)}
                                </span>
                              ))}
                        </div>

                        {/* Node Images Strip */}
                        {((node.images && node.images.length > 0) || node.imageUri) && (
                          <div className="node-image-strip">
                            {(node.images || (node.imageUri ? [node.imageUri] : [])).map((imgUrl, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={imgUrl}
                                alt={`Structure node ${node.nameLabel}`}
                                className="node-thumb-img"
                                onClick={() => window.open(imgUrl, '_blank')}
                                onError={(e) => {
                                  // Hide broken image link gracefully
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
