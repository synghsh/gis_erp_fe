import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
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
  Activity,
  Check,
  ExternalLink,
  AlertCircle,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight
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
  ListSurveyWorkService,
  GetSurveyDetailService,
  extractRecordsArray,
  extractDetailObject,
  extractPaginationMeta,
  type PaginationMeta
} from '../../services/workService';
import type { SurveyLineRecord, SurveyNode, ListSurveyPayload } from '../../models/workModels';
import './WorkDetails.css';

const breadcrumbs = [
  { label: 'Work Details' },
  { label: 'Survey Work' }
];

export const SurveyWorkPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [surveys, setSurveys] = useState<SurveyLineRecord[]>([]);

  // 10 Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stateId, setStateId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [blockId, setBlockId] = useState<string>('');
  const [feeder, setFeeder] = useState<string>('');
  const [contractorName, setContractorName] = useState<string>('');
  const [lineType, setLineType] = useState<string>('all');
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

  // Drawer detail state
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyLineRecord | null>(null);
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

  // Fetch survey listings from API with all 10 filters & pagination
  const fetchSurveys = async (params: {
    targetPageIndex?: number;
    targetPageSize?: number | null;
    isRefresh?: boolean;
    overrideFilters?: Partial<{
      stateId: string;
      districtId: string;
      blockId: string;
      feeder: string;
      contractorName: string;
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
      const curContractorName = params.overrideFilters?.contractorName !== undefined ? params.overrideFilters.contractorName : contractorName;
      const curLineType = params.overrideFilters?.lineType !== undefined ? params.overrideFilters.lineType : lineType;
      const curStatus = params.overrideFilters?.status !== undefined ? params.overrideFilters.status : status;
      const curStartDate = params.overrideFilters?.startDate !== undefined ? params.overrideFilters.startDate : startDate;
      const curEndDate = params.overrideFilters?.endDate !== undefined ? params.overrideFilters.endDate : endDate;
      const curSearch = params.overrideFilters?.searchQuery !== undefined ? params.overrideFilters.searchQuery : searchQuery;

      const curPageSize = params.targetPageSize !== undefined ? params.targetPageSize : pageSize;
      const curPageIndex = params.targetPageIndex !== undefined ? params.targetPageIndex : pageIndex;

      const payload: ListSurveyPayload = {
        search: curSearch.trim() || undefined,
        state_id: curStateId ? Number(curStateId) : null,
        district_id: curDistrictId ? Number(curDistrictId) : null,
        block_id: curBlockId ? Number(curBlockId) : null,
        feeder: curFeeder.trim() || undefined,
        contractor_name: curContractorName.trim() || undefined,
        line_type: curLineType !== 'all' ? curLineType : undefined,
        status: curStatus !== 'all' ? Number(curStatus) : null,
        start_date: curStartDate || null,
        end_date: curEndDate || null,
        page_size: curPageSize === null ? null : curPageSize,
        page_index: curPageSize === null ? null : curPageIndex,
      };

      const response = await ListSurveyWorkService(payload);
      const list = extractRecordsArray<SurveyLineRecord>(response);
      setSurveys(list);

      const meta = extractPaginationMeta(response);
      setPaginationMeta(meta);

      if (params.isRefresh) {
        dispatch(addToast({ message: 'Survey lines refreshed successfully', type: 'success' }));
      }
    } catch (err: any) {
      console.error('Failed to fetch survey lines:', err);
      setSurveys([]);
      dispatch(
        addToast({
          message: err?.response?.data?.Message || 'Failed to fetch survey lines from API',
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Filter actions
  const handleApplyFilters = () => {
    setPageIndex(1);
    fetchSurveys({ targetPageIndex: 1 });
  };

  const handleResetFilters = () => {
    setStateId('');
    setDistrictId('');
    setBlockId('');
    setFeeder('');
    setContractorName('');
    setLineType('all');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setPageIndex(1);
    fetchSurveys({
      targetPageIndex: 1,
      overrideFilters: {
        stateId: '',
        districtId: '',
        blockId: '',
        feeder: '',
        contractorName: '',
        lineType: 'all',
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
    fetchSurveys({ targetPageSize: newSize, targetPageIndex: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > paginationMeta.total_pages) return;
    setPageIndex(newPage);
    fetchSurveys({ targetPageIndex: newPage });
  };

  // Inspection Drawer Handler
  const handleViewDetails = async (record: SurveyLineRecord) => {
    setSelectedSurvey(record);
    setDrawerOpen(true);
    try {
      setLoadingDetail(true);
      const detailRes = await GetSurveyDetailService(record.id);
      const detail = extractDetailObject<SurveyLineRecord>(detailRes);
      if (detail) {
        setSelectedSurvey(detail);
      }
    } catch (e) {
      console.warn('Could not fetch single survey detail, using summary:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Safe list of surveys
  const safeSurveys = useMemo(() => {
    return Array.isArray(surveys) ? surveys : [];
  }, [surveys]);

  // Active filters count badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (stateId) count++;
    if (districtId) count++;
    if (blockId) count++;
    if (feeder.trim()) count++;
    if (contractorName.trim()) count++;
    if (lineType !== 'all') count++;
    if (status !== 'all') count++;
    if (startDate) count++;
    if (endDate) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [stateId, districtId, blockId, feeder, contractorName, lineType, status, startDate, endDate, searchQuery]);

  // KPIs
  const totalSurveys = safeSurveys.length;
  const htCount = safeSurveys.filter((s) => s.line_type && s.line_type.startsWith('HT')).length;
  const ltCount = safeSurveys.filter((s) => s.line_type && s.line_type.startsWith('LT')).length;
  const syncedCount = safeSurveys.filter((s) => s.is_synced).length;

  const renderLineTypePill = (lineType: string, display: string) => {
    let cls = 'lt440';
    if (lineType === 'HT_11KV') cls = 'ht11';
    else if (lineType === 'HT_33KV') cls = 'ht33';

    return (
      <span className={`line-type-pill ${cls}`}>
        <Activity size={12} />
        {display || lineType}
      </span>
    );
  };

  // Table Columns
  const columns: DataColumn<SurveyLineRecord>[] = [
    {
      key: 'id',
      label: 'Survey ID',
      sortable: true,
      width: '110px',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          #{row.id}
        </span>
      ),
    },
    {
      key: 'line_type',
      label: 'Line Type / Voltage',
      sortable: true,
      render: (row) => renderLineTypePill(row.line_type, row.line_type_display),
    },
    {
      key: 'contractor_name',
      label: 'Contractor Name',
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {row.contractor_name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'feeder_name',
      label: 'Location / Feeder',
      render: (row) => (
        <div style={{ fontSize: '12.5px' }}>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {row.feeder_name || 'Feeder N/A'}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>
            {row.state_name || ''}{row.district_name ? ` • ${row.district_name}` : ''}{row.block_name ? ` • ${row.block_name}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'surveyor_name',
      label: 'Surveyor',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {row.surveyor_name || 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      key: 'nodes_count',
      label: 'Survey Nodes',
      sortable: true,
      width: '130px',
      render: (row) => (
        <span className="nodes-counter-badge">
          <MapPin size={13} color="var(--accent-primary)" />
          {row.nodes_count} {row.nodes_count === 1 ? 'Point' : 'Points'}
        </span>
      ),
    },
    {
      key: 'is_synced',
      label: 'Cloud Sync',
      sortable: true,
      width: '130px',
      render: (row) => (
        <span className={`sync-status-badge ${row.is_synced ? 'synced' : 'pending'}`}>
          {row.is_synced ? <Check size={14} /> : <Clock size={14} />}
          {row.is_synced ? 'Synced' : 'Pending Sync'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (row) => (
        <Chips type={row.status === 1 ? 'success' : 'neutral'}>
          {row.status === 1 ? 'Active' : 'Archived'}
        </Chips>
      ),
    },
    {
      key: 'created_on',
      label: 'Survey Date',
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
          onClick={() => navigate(`/work-details/survey/${row.id}`)}
          title="View Full Survey Line Details"
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
            <h2 className="page-header-title">Survey Work Details</h2>
            <p className="page-header-sub">
              Monitor electrical distribution lines, GPS surveyed nodes, poles, and transformers
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`refresh-action-btn ${refreshing ? 'spinning' : ''}`}
              onClick={() => fetchSurveys({ isRefresh: true })}
              disabled={refreshing || loading}
              title="Refresh Records"
            >
              <RefreshCw size={16} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="work-stats-grid">
          <div className="work-stat-card">
            <div className="stat-icon-wrapper blue">
              <Compass size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{paginationMeta.total_count || totalSurveys}</span>
              <span className="stat-label">Total Survey Lines</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper purple">
              <Zap size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{htCount}</span>
              <span className="stat-label">HT Lines (11KV / 33KV)</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper amber">
              <Layers size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{ltCount}</span>
              <span className="stat-label">LT Lines (440V)</span>
            </div>
          </div>

          <div className="work-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{syncedCount}</span>
              <span className="stat-label">Cloud Synced Lines</span>
            </div>
          </div>
        </div>

        {/* 10-Filter Advanced Filter Panel */}
        <div className="work-advanced-filters">
          <div className="filters-header">
            <div className="filters-title-group">
              <span className="filters-heading">
                <Filter size={16} color="var(--accent-primary)" />
                Survey Line Filters
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
                onClick={() => fetchSurveys({ isRefresh: true })}
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
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
              >
                <option value="">All Contractors</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.contractor_name}>{c.contractor_name}</option>
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
                <option value="all">All Line Types</option>
                <option value="HT_11KV">11 KV High Tension (HT)</option>
                <option value="HT_33KV">33 KV High Tension (HT)</option>
                <option value="LT_440V">440 V Low Tension (LT)</option>
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
                <option value="1">Active</option>
                <option value="2">Archived</option>
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
              <label className="filter-field-label">Search / Keyword</label>
              <input
                type="text"
                className="filter-control-input"
                placeholder="Contractor, surveyor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
          </div>
        </div>

        {/* Main Content: Table or Empty/Loading */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <Loader size={36} />
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
              Loading Survey Work lines from API...
            </p>
          </div>
        ) : safeSurveys.length === 0 ? (
          <div className="glass-panel work-empty-state">
            <div className="work-empty-icon">
              <AlertCircle size={28} />
            </div>
            <h3 className="work-empty-title">No Survey Lines Found</h3>
            <p className="work-empty-subtitle">
              {activeFiltersCount > 0
                ? 'No survey lines match your filter criteria. Try resetting filters.'
                : 'No survey lines have been submitted yet.'}
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
            <DataTable<SurveyLineRecord>
              columns={columns}
              data={safeSurveys}
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
                  <label htmlFor="survey-pagesize">ix. Page Size:</label>
                  <select
                    id="survey-pagesize"
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

        {/* Survey Nodes Inspection Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedSurvey(null);
          }}
          title={
            selectedSurvey
              ? `Survey Line: ${selectedSurvey.line_type_display} (#${selectedSurvey.id})`
              : 'Survey Details'
          }
          maxWidth="640px"
          footer={
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Close Inspection
            </Button>
          }
        >
          {selectedSurvey && (
            <div>
              {loadingDetail && (
                <div style={{ marginBottom: '14px', color: 'var(--accent-primary)', fontSize: '13px' }}>
                  Fetching detailed GPS coordinates & node attributes...
                </div>
              )}

              {/* Line Metadata Overview */}
              <div className="drawer-detail-section">
                <div className="drawer-section-title">
                  <Compass size={16} /> Line Overview
                </div>
                <div className="detail-properties-grid">
                  <div className="detail-property-card">
                    <div className="prop-label">Line Type</div>
                    <div className="prop-val">{renderLineTypePill(selectedSurvey.line_type, selectedSurvey.line_type_display)}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Contractor</div>
                    <div className="prop-val">{selectedSurvey.contractor_name}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Surveyor</div>
                    <div className="prop-val">{selectedSurvey.surveyor_name || 'Unassigned'}</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Sync Status</div>
                    <div className="prop-val">
                      <span className={`sync-status-badge ${selectedSurvey.is_synced ? 'synced' : 'pending'}`}>
                        {selectedSurvey.is_synced ? <Check size={14} /> : <Clock size={14} />}
                        {selectedSurvey.is_synced ? 'Cloud Synced' : 'Pending Sync'}
                      </span>
                    </div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Total Survey Nodes</div>
                    <div className="prop-val">{selectedSurvey.nodes_count || selectedSurvey.nodes?.length || 0} Points</div>
                  </div>
                  <div className="detail-property-card">
                    <div className="prop-label">Survey Date</div>
                    <div className="prop-val">{selectedSurvey.created_on || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Nodes Sequence & Timeline */}
              <div className="drawer-detail-section">
                <div className="drawer-section-title">
                  <MapPin size={16} /> Surveyed GPS Nodes & Structures ({selectedSurvey.nodes?.length || 0})
                </div>

                {!selectedSurvey.nodes || selectedSurvey.nodes.length === 0 ? (
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    No nodes recorded on this survey line yet.
                  </p>
                ) : (
                  <div className="nodes-timeline-list">
                    {selectedSurvey.nodes.map((node: SurveyNode) => (
                      <div key={node.id || node.sequence_number} className="node-timeline-card">
                        <div className="node-card-header">
                          <div className="node-header-left">
                            <span className="node-seq-badge">{node.sequence_number}</span>
                            <span className="node-name-label">{node.name_label}</span>
                          </div>
                          <span className={`node-type-badge ${String(node.node_type).toLowerCase()}`}>
                            {node.node_type}
                          </span>
                        </div>

                        {/* GPS Coordinates with External Map link */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div className="node-gps-coordinates" style={{ marginBottom: 0 }}>
                            <MapPin size={13} color="var(--accent-primary)" />
                            <span>Lat: {node.latitude?.toFixed(6)}, Long: {node.longitude?.toFixed(6)}</span>
                          </div>
                          <a
                            href={`https://www.google.com/maps?q=${node.latitude},${node.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11.5px',
                              color: 'var(--accent-primary)',
                              textDecoration: 'none',
                            }}
                          >
                            Open Map <ExternalLink size={12} />
                          </a>
                        </div>

                        {node.parent_label && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Connected from: <strong style={{ color: 'var(--text-secondary)' }}>{node.parent_label}</strong>
                          </div>
                        )}

                        {/* Attributes Tags */}
                        {node.attributes && Object.keys(node.attributes).length > 0 && (
                          <div className="node-attributes-tags">
                            {Object.entries(node.attributes)
                              .filter(([k, v]) => v !== null && v !== undefined && v !== '')
                              .map(([k, v]) => (
                                <span key={k} className="attr-tag">
                                  {k}: {String(v)}
                                </span>
                              ))}
                          </div>
                        )}

                        {/* Node Photo preview if present */}
                        {node.image_path && (
                          <div className="node-image-strip">
                            <img
                              src={node.image_path}
                              alt={`Survey node ${node.name_label}`}
                              className="node-thumb-img"
                              onClick={() => window.open(node.image_path!, '_blank')}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
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

export default SurveyWorkPage;
