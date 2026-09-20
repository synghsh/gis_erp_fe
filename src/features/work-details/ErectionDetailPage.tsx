import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ErectionDetailData, ErectionNodeDetail } from '../../models/workModels';
import { GetErectionDetailService, extractDetailObject } from '../../services/workService';
import { MainLayout } from '../../components/layout/MainLayout';
import { WorkDetailMap } from './WorkDetailMap';
import './WorkDetails.css';
import {
  ArrowLeft,
  Calendar,
  Zap,
  MapPin,
  User,
  Phone,
  Mail,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Box,
  Cpu,
  Image as ImageIcon,
  Activity,
  Maximize2,
  X,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  Copy,
} from 'lucide-react';

type DetailTabKey = 'overview' | 'map' | 'breakdown' | 'progress';

interface LightboxState {
  isOpen: boolean;
  src: string;
  category: string;
  originalUri: string;
  nodeName: string;
  currentIndex: number;
  imageList: { src: string; category: string; originalUri: string }[];
}

export const ErectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ErectionDetailData | null>(null);
  const [lightboxData, setLightboxData] = useState<LightboxState | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview');
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('detailed');
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await GetErectionDetailService(Number(id));
      const detail = extractDetailObject<ErectionDetailData>(res);
      if (detail) {
        setData(detail);
        const initialExpanded: Record<number, boolean> = {};
        if (detail.nodes) {
          detail.nodes.forEach((n, idx) => {
            initialExpanded[n.id || idx] = true;
          });
        }
        setExpandedNodes(initialExpanded);
      } else {
        setError('Erection execution details could not be found.');
      }
    } catch (err: any) {
      console.error('Error fetching erection details:', err);
      setError(err?.response?.data?.Message || 'Failed to load erection details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const toggleNodeExpand = (nodeId: number) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleTabChange = (tab: DetailTabKey) => {
    setActiveTab(tab);
    if (tab === 'map') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 150);
    }
  };

  // Helper to render materials summary into vibrant multi-colored chips
  const renderMaterialChips = (summary: string) => {
    if (!summary || summary === 'No additional materials recorded' || summary === '-') {
      return <span className="table-muted-text">-</span>;
    }
    const parts = summary.split(',').map((s) => s.trim()).filter(Boolean);
    return (
      <div className="table-mat-chips-wrap">
        {parts.map((part, idx) => {
          let typeClass = 'default';
          const lower = part.toLowerCase();
          if (lower.includes('earthing')) typeClass = 'earthing';
          else if (lower.includes('stay set')) typeClass = 'stay-set';
          else if (lower.includes('ipc')) typeClass = 'ipc';
          else if (lower.includes('dead-end') || lower.includes('dead end')) typeClass = 'dead-end';
          else if (lower.includes('suspension')) typeClass = 'suspension';
          else if (lower.includes('service')) typeClass = 'service';
          else if (lower.includes('pole db') || lower.includes('db')) typeClass = 'pole-db';
          else if (lower.includes('pole')) typeClass = 'pole';

          return (
            <span key={idx} className={`mat-pill ${typeClass}`}>
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  // Helper to resolve image source strictly from API response (no fallback, no hardcoded images)
  const resolveImageSource = (imgUri: string) => {
    if (!imgUri) return '';
    return imgUri.trim();
  };

  const getImageCategoryLabel = (imgUri: string, index: number = 0, node?: ErectionNodeDetail) => {
    const attrs = node?.attributes || {};
    if (attrs.polePhotos?.includes(imgUri)) return 'Pole Structure';
    if (attrs.poleDbPhotos?.includes(imgUri)) return 'Pole Distribution Box';
    if (attrs.staySetPhotos?.includes(imgUri)) return 'Stay Set Assembly';
    if (attrs.earthingPhotos?.includes(imgUri)) return 'Earthing Installation';

    // Heuristic matching for Cloudflare R2 presigned URLs / object keys
    const upper = (imgUri || '').toUpperCase();
    if (upper.includes('POLE_DB') || upper.includes('POLEDB')) return 'Pole Distribution Box';
    if (upper.includes('EARTHING')) return 'Earthing Installation';
    if (upper.includes('STAY_SET') || upper.includes('STAYSET')) return 'Stay Set Assembly';
    if (upper.includes('POLE')) return 'Pole Structure';

    const defaultTitles = ['Pole Structure', 'Distribution Box', 'Stay Set Assembly', 'Earthing Installation'];
    return defaultTitles[index % defaultTitles.length] || `Field Photo #${index + 1}`;
  };

  const openLightbox = (node: ErectionNodeDetail, targetIndex: number) => {
    if (!node.images || node.images.length === 0) return;
    const imageList = node.images.map((uri, idx) => ({
      src: resolveImageSource(uri),
      category: getImageCategoryLabel(uri, idx, node),
      originalUri: uri,
    }));

    const safeIndex = Math.max(0, Math.min(targetIndex, imageList.length - 1));
    setLightboxData({
      isOpen: true,
      src: imageList[safeIndex].src,
      category: imageList[safeIndex].category,
      originalUri: imageList[safeIndex].originalUri,
      nodeName: node.name_label || `Node #${node.sequence_number + 1}`,
      currentIndex: safeIndex,
      imageList,
    });
  };

  const nextLightboxImage = () => {
    if (!lightboxData || lightboxData.imageList.length <= 1) return;
    const nextIdx = (lightboxData.currentIndex + 1) % lightboxData.imageList.length;
    const item = lightboxData.imageList[nextIdx];
    setLightboxData({
      ...lightboxData,
      currentIndex: nextIdx,
      src: item.src,
      category: item.category,
      originalUri: item.originalUri,
    });
  };

  const prevLightboxImage = () => {
    if (!lightboxData || lightboxData.imageList.length <= 1) return;
    const prevIdx = (lightboxData.currentIndex - 1 + lightboxData.imageList.length) % lightboxData.imageList.length;
    const item = lightboxData.imageList[prevIdx];
    setLightboxData({
      ...lightboxData,
      currentIndex: prevIdx,
      src: item.src,
      category: item.category,
      originalUri: item.originalUri,
    });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData?.isOpen) return;
      if (e.key === 'Escape') setLightboxData(null);
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  const breadcrumbs = [
    { label: 'Work Details' },
    { label: 'Erection Work', path: '/work-details/erection' },
    { label: data?.drawing_no || `DWG - ${id}` }
  ];

  if (loading) {
    return (
      <MainLayout breadcrumbItems={breadcrumbs}>
        <div className="work-detail-container">
          <div className="detail-loading-state glass-panel">
            <div className="loading-spinner-large"></div>
            <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Loading Erection Execution Details...</h3>
            <p style={{ color: 'var(--text-muted)' }}>Preparing map topology, material KPIs, and day-wise progress logs.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout breadcrumbItems={breadcrumbs}>
        <div className="work-detail-container">
          <div className="detail-error-state glass-panel">
            <AlertCircle size={48} color="#ef4444" />
            <h3 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>Unable to Load Details</h3>
            <p style={{ color: 'var(--text-muted)' }}>{error || 'Record not found'}</p>
            <button type="button" className="back-link-btn" onClick={() => navigate('/work-details/erection')} style={{ marginTop: '16px' }}>
              <ArrowLeft size={16} /> Back to Erection Listing
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const mat = data.material_summary || {
    total_poles: 0,
    new_poles_count: 0,
    old_poles_count: 0,
    total_dtr: 0,
    total_route_length_meters: 0,
    total_earthing: 0,
    total_stay_sets: 0,
    total_dead_end_clamps: 0,
    total_suspension_clamps: 0,
    total_pole_clamps: 0,
    total_ipc: 0,
    total_service_connections: 0,
    total_extra_consumption: 0,
    total_pole_db: 0,
    conductor_names: []
  };

  const prog = data.progress_summary || {
    total_working_days: 1,
    total_calendar_days: 1,
    start_date: null,
    completion_date: null
  };

  const formattedRouteLength = mat.total_route_length_meters >= 1000
    ? `${(mat.total_route_length_meters / 1000).toFixed(2)} km`
    : `${Math.round(mat.total_route_length_meters)} m`;

  const locationSubtitle = [data.block_name, data.district_name].filter(Boolean).join(', ') || 'Location Details';

  const poleDbSummaryText = mat.pole_db_summary && Object.keys(mat.pole_db_summary).length > 0
    ? Object.entries(mat.pole_db_summary).map(([type, qty]) => `Type ${type}: ${qty}`).join(', ')
    : 'None Recorded';

  const totalAssetsCount = (data.nodes?.length) ?? (mat.total_poles + mat.total_dtr);

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      <div className="work-detail-container no-top-gap">
        {/* =========================================================================
            HERO BANNER SECTION (Light, Multi-coloured, No Gap above it)
            ========================================================================= */}
        <div className="detail-hero-banner light-multi">
          <div className="hero-top-status-row">
            <div className="hero-left-actions">
              <button
                type="button"
                className="hero-back-btn"
                onClick={() => navigate('/work-details/erection')}
                title="Back to Execution List"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <div className="hero-progress-pill light">
                <Activity size={14} />
                <span>Execution In Progress</span>
              </div>
            </div>

            <div className="hero-badges-right">
              <div className="hero-duration-badge light">
                <Calendar size={14} />
                <span>
                  {prog.total_working_days} Working Day{prog.total_working_days !== 1 ? 's' : ''} ({prog.total_calendar_days} Cal Day{prog.total_calendar_days !== 1 ? 's' : ''})
                </span>
              </div>

              <div className="hero-active-badge light">
                <Zap size={14} />
                <span>{data.status_label || (data.status === 2 ? 'Completed' : 'Active')}</span>
              </div>

              <button
                type="button"
                className="hero-mini-action-btn"
                onClick={fetchDetail}
                title="Refresh Details"
              >
                <RefreshCw size={14} />
              </button>

              <button
                type="button"
                className="hero-mini-action-btn"
                onClick={() => window.print()}
                title="Print Summary"
              >
                <FileText size={14} />
              </button>
            </div>
          </div>

          <div className="hero-center-content">
            <h1 className="hero-dwg-title light">{data.drawing_no || `DWG - ${data.id}`}</h1>
            <div className="hero-meta-chips light">
              <span className="hero-meta-chip chip-feeder">
                <Zap size={13} color="#0284c7" /> Feeder: <strong>{data.feeder_name || 'N/A'}</strong>
              </span>
              <span className="hero-meta-chip chip-location">
                <MapPin size={13} color="#d97706" /> <strong>{locationSubtitle}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            INDUSTRY-STANDARD TAB NAVIGATION BAR
            ========================================================================= */}
        <div className="detail-tabs-bar" role="tablist">
          {/* Tab 1: Overview & Material Summary */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`detail-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <Layers size={16} />
            <span>Overview &amp; Materials</span>
            {/* <span className="tab-badge">12 KPIs</span> */}
          </button>

          {/* Tab 2: Conductor Route & Topology Map */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'map'}
            className={`detail-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => handleTabChange('map')}
          >
            <Zap size={16} />
            <span>Route &amp; Topology Map</span>
            <span className="tab-badge">{formattedRouteLength}</span>
          </button>

          {/* Tab 3: Pole & DTR Asset Breakdown */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'breakdown'}
            className={`detail-tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
            onClick={() => handleTabChange('breakdown')}
          >
            <Box size={16} />
            <span>Pole &amp; DTR Breakdown</span>
            {/* <span className="tab-badge">{totalAssetsCount} Assets</span> */}
          </button>

          {/* Tab 4: Daily Erection Progress Logs */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'progress'}
            className={`detail-tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => handleTabChange('progress')}
          >
            <Calendar size={16} />
            <span>Daily Progress Logs</span>
            {/* <span className="tab-badge">{prog.total_working_days} Days</span> */}
          </button>
        </div>

        {/* =========================================================================
            TAB CONTENT PANELS
            ========================================================================= */}

        {/* TAB 1: OVERVIEW & MATERIAL SUMMARY */}
        {activeTab === 'overview' && (
          <div className="tab-panel-content">
            {/* 1. Total Material Summary (Light & Multi-coloured Card) */}
            <div className="detail-section-dark-card light-theme border-top-blue">
              <div className="dark-card-header light-theme">
                <div className="dark-card-title light-theme">
                  <Box size={18} color="#0284c7" />
                  <span>Total Material Summary</span>
                </div>
              </div>

              <div className="summary-cards-grid-12">
                {/* 1. Total Poles */}
                <div className="summary-metric-card light-theme border-accent-purple">
                  <div className="metric-top-row">
                    <div className="metric-icon-square purple">
                      <Layers size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_poles}</div>
                  </div>
                  <div className="metric-label light-theme">Total Poles</div>
                  <div className="metric-tags-row">
                    <span className="metric-tag cyan">{mat.new_poles_count} New</span>
                    <span className="metric-tag amber">{mat.old_poles_count} Old</span>
                  </div>
                </div>

                {/* 2. Total DTRs */}
                <div className="summary-metric-card light-theme border-accent-green">
                  <div className="metric-top-row">
                    <div className="metric-icon-square green">
                      <Cpu size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_dtr}</div>
                  </div>
                  <div className="metric-label light-theme">Total DTRs</div>
                  <div className="metric-tags-row">
                    <span className="metric-tag green">
                      {mat.total_dtr > 0 ? 'Transformers Verified' : 'None Verified'}
                    </span>
                  </div>
                </div>

                {/* 3. Conductor Span */}
                <div className="summary-metric-card light-theme border-accent-cyan">
                  <div className="metric-top-row">
                    <div className="metric-icon-square cyan">
                      <Zap size={18} />
                    </div>
                    <div className="metric-val light-theme">{formattedRouteLength}</div>
                  </div>
                  <div className="metric-label light-theme">Conductor Span</div>
                  <div className="metric-tags-row wrap">
                    {mat.conductor_names && mat.conductor_names.length > 0 ? (
                      mat.conductor_names.map((c, i) => (
                        <span key={i} className="metric-tag blue">{c}</span>
                      ))
                    ) : (
                      <span className="metric-tag gray">-</span>
                    )}
                  </div>
                </div>

                {/* 4. Earthing Sets */}
                <div className="summary-metric-card light-theme border-accent-indigo">
                  <div className="metric-top-row">
                    <div className="metric-icon-square indigo">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_earthing || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Earthing Sets</div>
                  <div className="metric-subtext light-theme">Pipe &amp; Coil Earthing Sets</div>
                </div>

                {/* 5. Stay Sets */}
                <div className="summary-metric-card light-theme border-accent-violet">
                  <div className="metric-top-row">
                    <div className="metric-icon-square violet">
                      <Activity size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_stay_sets || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Stay Sets</div>
                  <div className="metric-subtext light-theme">Guy / Stay Assemblies</div>
                </div>

                {/* 6. Dead End Clamps */}
                <div className="summary-metric-card light-theme border-accent-pink">
                  <div className="metric-top-row">
                    <div className="metric-icon-square pink">
                      <Layers size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_dead_end_clamps || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Dead End Clamps</div>
                  <div className="metric-subtext light-theme">Tension Anchoring Clamps</div>
                </div>

                {/* 7. Suspension Clamps */}
                <div className="summary-metric-card light-theme border-accent-teal">
                  <div className="metric-top-row">
                    <div className="metric-icon-square teal">
                      <Layers size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_suspension_clamps || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Suspension Clamps</div>
                  <div className="metric-subtext light-theme">Intermediate Line Clamps</div>
                </div>

                {/* 8. Pole Clamps */}
                <div className="summary-metric-card light-theme border-accent-amber">
                  <div className="metric-top-row">
                    <div className="metric-icon-square purple">
                      <Layers size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_pole_clamps || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Pole Clamps</div>
                  <div className="metric-subtext light-theme">Steel Structure Clamps</div>
                </div>

                {/* 9. IPC Connectors */}
                <div className="summary-metric-card light-theme border-accent-blue">
                  <div className="metric-top-row">
                    <div className="metric-icon-square emerald">
                      <Zap size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_ipc || 0}</div>
                  </div>
                  <div className="metric-label light-theme">IPC Connectors</div>
                  <div className="metric-subtext light-theme">Insulation Piercing Connectors</div>
                </div>

                {/* 10. Service Connections */}
                <div className="summary-metric-card light-theme border-accent-green">
                  <div className="metric-top-row">
                    <div className="metric-icon-square sky">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_service_connections || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Service Connections</div>
                  <div className="metric-subtext light-theme">Consumer Drop Connections</div>
                </div>

                {/* 11. Pole DBs */}
                <div className="summary-metric-card light-theme border-accent-orange">
                  <div className="metric-top-row">
                    <div className="metric-icon-square blue">
                      <Box size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_pole_db || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Total Pole DBs</div>
                  <div className="metric-subtext light-theme" title={poleDbSummaryText}>
                    {poleDbSummaryText}
                  </div>
                </div>

                {/* 12. Extra Consumption */}
                <div className="summary-metric-card light-theme border-accent-slate">
                  <div className="metric-top-row">
                    <div className="metric-icon-square emerald">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="metric-val light-theme">{mat.total_extra_consumption || 0}</div>
                  </div>
                  <div className="metric-label light-theme">Extra Consumption</div>
                  <div className="metric-subtext light-theme">Additional Installed Units</div>
                </div>
              </div>
            </div>

            {/* 2. Metadata Tri-Column Section (Light Surface Cards with Colorful Accent Borders) */}
            <div className="metadata-tri-column-grid" style={{ marginTop: '20px' }}>
              {/* Card 1: Project & Contractor Info */}
              <div className="meta-light-card border-top-blue">
                <div className="meta-light-header">
                  <div className="meta-header-title">
                    <div className="meta-icon-circle blue">
                      <Box size={15} />
                    </div>
                    <h3>Project &amp; Contractor Info</h3>
                  </div>
                  <button
                    type="button"
                    className="meta-header-action-link"
                    onClick={() => handleTabChange('breakdown')}
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>

                <div className="meta-field-grid">
                  <div className="meta-field-item">
                    <span className="meta-field-label">BASIC EXECUTION DETAILS</span>
                    <span className="meta-field-value bold">{data.drawing_no || `DWG - ${data.id}`}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">FEEDER NAME</span>
                    <span className="meta-field-value">{data.feeder_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">DTRA CODE</span>
                    <span className="meta-field-value">{data.dtr_code || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">TYPE OF WORK</span>
                    <span className="meta-field-value bold">{data.type_of_work_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">LISTING POINT</span>
                    <span className="meta-field-value bold">{data.lt_starting_point_name || 'POLE'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">STATUS</span>
                    <span className="meta-field-value status-active">
                      {data.status_label || (data.status === 2 ? 'Completed' : 'Active')}
                    </span>
                  </div>
                  <div className="meta-field-item full-width">
                    <span className="meta-field-label">REMARKS</span>
                    <span className="meta-field-value muted">{data.remarks || 'No remarks recorded.'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Location & Geography */}
              <div className="meta-light-card border-top-emerald">
                <div className="meta-light-header">
                  <div className="meta-header-title">
                    <div className="meta-icon-circle green">
                      <MapPin size={15} />
                    </div>
                    <h3>Location &amp; Geography</h3>
                  </div>
                </div>

                <div className="meta-field-grid">
                  <div className="meta-field-item">
                    <span className="meta-field-label">STATE</span>
                    <span className="meta-field-value">{data.state_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">DISTRICT</span>
                    <span className="meta-field-value bold">{data.district_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">BLOCK</span>
                    <span className="meta-field-value bold">{data.block_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">VILLAGE / LOCALITY</span>
                    <span className="meta-field-value">{data.village_name || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">CREATED ON</span>
                    <span className="meta-field-value mono">{data.created_on || 'N/A'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">LAST UPDATED</span>
                    <span className="meta-field-value mono">{data.updated_on || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Execution & Surveyor Profile */}
              <div className="meta-light-card border-top-violet">
                <div className="meta-light-header">
                  <div className="meta-header-title">
                    <div className="meta-icon-circle teal">
                      <User size={15} />
                    </div>
                    <h3>Execution &amp; Surveyor Profile</h3>
                  </div>
                </div>

                <div className="meta-field-grid">
                  <div className="meta-field-item full-width">
                    <span className="meta-field-label">CONTRACTOR NAME</span>
                    <span className="meta-field-value primary-bold">{data.contractor_name || 'Unassigned Contractor'}</span>
                  </div>
                  <div className="meta-field-item full-width">
                    <span className="meta-field-label">SURVEYOR / SUPERVISOR</span>
                    <span className="meta-field-value bold">{data.surveyor_name || 'Unassigned'}</span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">SURVEYOR MOBILE</span>
                    <span className="meta-field-value link">
                      {data.surveyor_phone ? (
                        <a href={`tel:${data.surveyor_phone}`}>{data.surveyor_phone}</a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                  <div className="meta-field-item">
                    <span className="meta-field-label">SURVEYOR EMAIL</span>
                    <span className="meta-field-value link">
                      {data.surveyor_email ? (
                        <a href={`mailto:${data.surveyor_email}`}>{data.surveyor_email}</a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                  <div className="meta-field-item full-width">
                    <span className="meta-field-label">EXECUTION DURATION</span>
                    <span className="meta-field-value duration-pill-text">
                      {prog.start_date && prog.completion_date
                        ? `${prog.start_date} → ${prog.completion_date}`
                        : (data.created_on ? data.created_on.substring(0, 10) : 'N/A')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONDUCTOR ROUTE & TOPOLOGY MAP */}
        {activeTab === 'map' && (
          <div className="tab-panel-content">
            <div className="map-section-card border-top-cyan">
              <div className="map-card-top-header">
                <div className="map-title-left">
                  <Zap size={18} color="#0284c7" />
                  <h2 className="map-title-text">Conductor Route &amp; Node Topology Map</h2>
                </div>

                {/* Interactive Legend in Header */}
                <div className="map-header-legend">
                  <div className="legend-entry">
                    <span className="legend-dot blue"></span>
                    <span>New Pole</span>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-dot orange"></span>
                    <span>Old Pole</span>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-dot green"></span>
                    <span>DTR Node</span>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-line blue-solid"></span>
                    <span>Conductor Line</span>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-line dashed"></span>
                    <span>In-between Span</span>
                  </div>
                </div>
              </div>

              <WorkDetailMap
                nodes={data.nodes || []}
                lineTitle={data.drawing_no || `DWG - ${data.id}`}
                height="560px"
                totalRouteLengthMeters={mat.total_route_length_meters}
                totalPoles={mat.total_poles}
                totalDtrs={mat.total_dtr}
              />
            </div>
          </div>
        )}

        {/* TAB 3: POLE & DTR ASSET BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="tab-panel-content">
            <div id="nodes-breakdown-section" className="breakdown-section-card border-top-purple">
              <div className="breakdown-section-header">
                <div className="breakdown-title-left">
                  <div className="breakdown-icon-circle purple">
                    <Box size={16} />
                  </div>
                  <div>
                    <h2 className="breakdown-title-text">Pole &amp; DTR Wise Material Breakdown &amp; Field Photos</h2>
                    <span className="breakdown-subtitle-text">Structure specifications, clamp allocations, and camera photos recorded during field erection.</span>
                  </div>
                </div>

                <div className="breakdown-controls-right">
                  <div className="view-toggle-pill-group">
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'summary' ? 'active' : ''}`}
                      onClick={() => setViewMode('summary')}
                    >
                      Summary
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                      onClick={() => setViewMode('detailed')}
                    >
                      Detailed
                    </button>
                  </div>

                  <button
                    type="button"
                    className="expand-all-icon-btn"
                    title="Expand / Collapse All Nodes"
                    onClick={() => {
                      const anyCollapsed = data.nodes?.some((n, idx) => !expandedNodes[n.id || idx]);
                      const nextState: Record<number, boolean> = {};
                      data.nodes?.forEach((n, idx) => {
                        nextState[n.id || idx] = anyCollapsed ?? true;
                      });
                      setExpandedNodes(nextState);
                    }}
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>

              {/* Nodes List */}
              <div className="node-breakdown-cards-list">
                {data.nodes && data.nodes.length > 0 ? (
                  data.nodes.map((node, index) => {
                    const isDTR = node.node_type === 'DTR';
                    const isNew = node.is_new_pole !== false;
                    const nodeId = node.id || index;
                    const isExpanded = viewMode === 'detailed' && (expandedNodes[nodeId] ?? true);
                    const photosCount = node.images ? node.images.length : 0;
                    const cardBorderClass = isDTR ? 'border-left-emerald' : (isNew ? 'border-left-blue' : 'border-left-amber');

                    return (
                      <div key={nodeId} className={`node-detail-card ${cardBorderClass}`}>
                        {/* Card Header Row */}
                        <div className="node-card-top-bar" onClick={() => toggleNodeExpand(nodeId)}>
                          <div className="node-bar-left">
                            <div className="node-checkbox-icon">
                              <CheckSquare size={18} color={isDTR ? '#10b981' : (isNew ? '#0284c7' : '#f59e0b')} />
                            </div>
                            <span className="node-name-text">{node.name_label || `Node ${index + 1}`}</span>
                            <span className={`node-type-pill ${isDTR ? 'dtr' : (isNew ? 'new-pole' : 'old-pole')}`}>
                              {node.structure_condition_label || (isDTR ? 'DTR' : (isNew ? 'New Pole' : 'Old Pole'))}
                            </span>
                          </div>

                          <div className="node-bar-right">
                            {node.distance_to_prev_meters > 0 && (
                              <div className="node-span-pill">
                                Span: {node.distance_to_prev_meters >= 1000
                                  ? (node.distance_to_prev_meters / 1000).toFixed(2) + ' km'
                                  : Math.round(node.distance_to_prev_meters) + ' m'}
                              </div>
                            )}

                            <div className="node-gps-pill">
                              {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                            </div>

                            <button
                              type="button"
                              className="node-expand-toggle-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNodeExpand(nodeId);
                              }}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {photosCount > 0 && (
                              <button
                                type="button"
                                className="node-view-photos-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLightbox(node, 0);
                                }}
                              >
                                <ImageIcon size={14} />
                                <span>View Photos ({photosCount})</span>
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Card Material Grid (Collapsible) */}
                        {isExpanded && (
                          <div className="node-card-body">
                            <div className="node-material-grid-row">
                              {isDTR ? (
                                <>
                                  <div className="node-mat-cell">
                                    <span className="node-mat-label">DTR CAPACITY</span>
                                    <span className="node-mat-val bold">{node.dtr_capacity_name || node.attributes?.dtrCapacity || '-'}</span>
                                  </div>
                                  <div className="node-mat-cell">
                                    <span className="node-mat-label">SERIAL NUMBER</span>
                                    <span className="node-mat-val">{node.dtr_serial_no || '-'}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="node-mat-cell">
                                    <span className="node-mat-label">POLE TYPE</span>
                                    <span className="node-mat-val">{node.pole_type_name || node.attributes?.poleType || '-'}</span>
                                  </div>
                                  <div className="node-mat-cell">
                                    <span className="node-mat-label">POLE QTY</span>
                                    <span className="node-mat-val bold">{node.pole_qty ?? 1}</span>
                                  </div>
                                </>
                              )}

                              <div className="node-mat-cell">
                                <span className="node-mat-label">CONDUCTOR CABLE</span>
                                <span className="node-mat-val bold">{node.conductor_name || node.attributes?.cableSize || '-'}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">EARTHING QTY</span>
                                <span className="node-mat-val">{node.earthing_quantity ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">STAY SET QTY</span>
                                <span className="node-mat-val">{node.stay_set_quantity ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">DEAD END CLAMPS</span>
                                <span className="node-mat-val">{node.dead_end_clamp_qty ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">SUSPENSION CLAMPS</span>
                                <span className="node-mat-val">{node.suspension_clamp_qty ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">POLE CLAMPS</span>
                                <span className="node-mat-val">{node.pole_clamp_qty ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">IPC CONNECTORS</span>
                                <span className="node-mat-val">{node.ipc_qty ?? 0}</span>
                              </div>

                              <div className="node-mat-cell">
                                <span className="node-mat-label">SERVICE CONNECTIONS</span>
                                <span className="node-mat-val">{node.service_connection_qty ?? 0}</span>
                              </div>

                              {node.pole_db_quantities && Object.keys(node.pole_db_quantities).length > 0 && (
                                <div className="node-mat-cell">
                                  <span className="node-mat-label">POLE DBS</span>
                                  <span className="node-mat-val">
                                    {Object.entries(node.pole_db_quantities).map(([t, q]) => `T${t}: ${q}`).join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Captured Photos Gallery */}
                            <div className="node-card-photos-tray">
                              <div className="photos-tray-label">
                                <ImageIcon size={14} color="#0284c7" />
                                <span>Captured Field Inspection Photos ({photosCount})</span>
                              </div>

                              {photosCount > 0 ? (
                                <div className="photos-thumbnails-row">
                                  <div className="photos-row-items">
                                    {node.images.map((imgUri, imgIdx) => {
                                      const resolvedSrc = resolveImageSource(imgUri);
                                      const catLabel = getImageCategoryLabel(imgUri, imgIdx, node);
                                      const fileName = imgUri.split('/').pop() || `Photo #${imgIdx + 1}`;
                                      const hasError = imgErrors[imgUri];

                                      return (
                                        <div
                                          key={imgIdx}
                                          className={`photo-square-thumb ${hasError ? 'load-failed' : ''}`}
                                          onClick={() => openLightbox(node, imgIdx)}
                                          title={`${catLabel} - ${fileName} (Click to inspect)`}
                                        >
                                          {!hasError ? (
                                            <img
                                              src={resolvedSrc}
                                              alt={catLabel}
                                              className="thumb-img"
                                              onError={() => {
                                                setImgErrors((prev) => ({ ...prev, [imgUri]: true }));
                                              }}
                                            />
                                          ) : (
                                            <div className="thumb-file-badge">
                                              <ImageIcon size={18} color="#0284c7" />
                                              <span className="thumb-file-name" title={fileName}>
                                                {fileName.length > 15 ? fileName.substring(0, 13) + '...' : fileName}
                                              </span>
                                              <span className="thumb-file-type">{catLabel}</span>
                                            </div>
                                          )}
                                          <span className="thumb-cat-badge">{catLabel}</span>
                                          <div className="thumb-hover-overlay">
                                            <Maximize2 size={16} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <button
                                    type="button"
                                    className="view-all-photos-pill-btn"
                                    onClick={() => openLightbox(node, 0)}
                                  >
                                    <span>View All ({photosCount})</span>
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="no-images-text-subtle">
                                  No images uploaded for this node.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-nodes-panel">
                    No pole or DTR nodes recorded for this execution.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DAILY ERECTION PROGRESS LOGS (Light & Multi-Coloured Section II) */}
        {activeTab === 'progress' && (
          <div className="tab-panel-content">
            <div className="progress-section-light-card border-top-green">
              <div className="progress-light-header">
                <div className="progress-light-title-left">
                  <div className="progress-check-circle light">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h2 className="progress-title-text light">Day-Wise Erection Progress &amp; Daily Work Logs</h2>
                    <span className="progress-subtitle-text light">
                      Daily Chronicle of poles erected, DTRs installed, material delivered through the app, and incremental additions.
                    </span>
                  </div>
                </div>

                <div className="total-erected-days-badge light">
                  <Clock size={14} />
                  <span>Total Erected Days: {prog.total_working_days} Day{prog.total_working_days > 1 ? 's' : ''} to Complete</span>
                </div>
              </div>

              <div className="progress-table-responsive-wrapper">
                <table className="progress-light-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>
                        <span className="th-indicator blue"></span> DATE
                      </th>
                      <th style={{ minWidth: '180px' }}>
                        <span className="th-indicator green"></span> NODES HANDLED
                      </th>
                      <th style={{ minWidth: '220px' }}>
                        <span className="th-indicator purple"></span> WORK DETAILS DONE THROUGH APP
                      </th>
                      <th style={{ minWidth: '260px' }}>
                        <span className="th-indicator amber"></span> MATERIALS INSTALLED ON THIS DAY
                      </th>
                      <th style={{ width: '130px' }}>
                        <span className="th-indicator cyan"></span> SPANS ERECTED
                      </th>
                      <th style={{ width: '120px' }}>
                        <span className="th-indicator rose"></span> PHOTOS TAKEN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.day_wise_progress && data.day_wise_progress.length > 0 ? (
                      data.day_wise_progress.map((day) => (
                        <tr key={day.day_number}>
                          <td>
                            <div className="table-day-cell light">
                              <span className="day-number-badge">{day.date}</span>
                              {/* <span className="day-date-sub light">{day.date}</span> */}
                            </div>
                          </td>
                          <td>
                            <div className="table-nodes-chip-group">
                              {day.nodes_summary && day.nodes_summary.length > 0 ? (
                                day.nodes_summary.map((ns, idx) => {
                                  const isOld = ns.includes('OLD') || ns.includes('Old');
                                  const isDTR = ns.includes('DTR');
                                  return (
                                    <span
                                      key={idx}
                                      className={`table-node-chip ${isDTR ? 'dtr' : (isOld ? 'old' : 'new')}`}
                                    >
                                      {ns}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="table-muted-text">-</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="table-work-desc light">
                              {day.work_description}
                            </div>
                          </td>
                          <td>
                            {renderMaterialChips(day.materials_summary)}
                          </td>
                          <td>
                            <span className="table-span-highlight light">
                              {day.span_meters >= 1000
                                ? `${(day.span_meters / 1000).toFixed(2)} km`
                                : `${Math.round(day.span_meters)} m`}
                            </span>
                          </td>
                          <td>
                            <div
                              className={`table-photos-pill light ${day.photos_count > 0 ? 'clickable-photo-pill' : ''}`}
                              onClick={() => {
                                if (day.photos_count > 0) handleTabChange('breakdown');
                              }}
                              title={day.photos_count > 0 ? 'Click to view photos in Breakdown tab' : 'No photos recorded'}
                            >
                              <ImageIcon size={13} />
                              <span>{day.photos_count} Photo{day.photos_count !== 1 ? 's' : ''}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                          No day-wise entries recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            INTERACTIVE FIELD INSPECTION PHOTO LIGHTBOX MODAL
            ========================================================================= */}
        {lightboxData && lightboxData.isOpen && (
          <div className="lightbox-backdrop" onClick={() => setLightboxData(null)}>
            <div className="lightbox-modal animate-lightbox-zoom" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox-header">
                <div className="lightbox-header-left">
                  <div className="lightbox-cat-badge">
                    <Sparkles size={14} />
                    <span>{lightboxData.category}</span>
                  </div>
                  <span className="lightbox-node-name">{lightboxData.nodeName}</span>
                  <span className="lightbox-counter-badge">
                    {lightboxData.currentIndex + 1} / {lightboxData.imageList.length}
                  </span>
                </div>

                <div className="lightbox-header-actions">
                  {lightboxData.src.startsWith('http') || lightboxData.src.startsWith('data:') ? (
                    <a
                      href={lightboxData.src}
                      download={`inspection_${lightboxData.nodeName}_photo${lightboxData.currentIndex + 1}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="lightbox-action-btn"
                      title="Download Photo"
                    >
                      <Download size={15} />
                      <span>Download</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="lightbox-action-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(lightboxData.originalUri);
                        alert('Copied image URI to clipboard!');
                      }}
                      title="Copy Image URI"
                    >
                      <Copy size={15} />
                      <span>Copy URI</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="lightbox-close-btn"
                    onClick={() => setLightboxData(null)}
                    title="Close preview (Esc)"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="lightbox-body">
                {lightboxData.imageList.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav-btn prev"
                    onClick={prevLightboxImage}
                    title="Previous Photo (Left Arrow)"
                  >
                    <ChevronLeft size={28} />
                  </button>
                )}

                <div className="lightbox-img-wrapper">
                  {!imgErrors[lightboxData.src] ? (
                    <img
                      src={lightboxData.src}
                      alt={lightboxData.category}
                      className="lightbox-img"
                      onError={() => {
                        setImgErrors((prev) => ({ ...prev, [lightboxData.src]: true }));
                      }}
                    />
                  ) : (
                    <div className="lightbox-file-info-card">
                      <div className="file-info-icon-circle">
                        <ImageIcon size={38} color="#0284c7" />
                      </div>
                      <h3 className="file-info-title">{lightboxData.category}</h3>
                      <p className="file-info-desc">
                        Original image URI captured during survey and returned in API response:
                      </p>
                      <div className="file-uri-code-box">
                        <code>{lightboxData.originalUri}</code>
                      </div>
                      <div className="file-info-notice">
                        <AlertCircle size={16} color="#f59e0b" />
                        <span>
                          {lightboxData.originalUri.startsWith('file://')
                            ? 'Local Mobile Device URI: Captured by the surveyor app and stored in local phone cache. Web browsers restrict direct local device filesystem access for security.'
                            : 'Unable to render image from the provided API response URL.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {lightboxData.imageList.length > 1 && (
                  <button
                    type="button"
                    className="lightbox-nav-btn next"
                    onClick={nextLightboxImage}
                    title="Next Photo (Right Arrow)"
                  >
                    <ChevronRight size={28} />
                  </button>
                )}
              </div>

              <div className="lightbox-footer">
                <div className="lightbox-footer-tags">
                  <span className="lightbox-tag verified">
                    <CheckCircle2 size={13} /> Field Inspection Verified
                  </span>
                  <span className="lightbox-tag file-source" title={lightboxData.originalUri}>
                    Source: {lightboxData.originalUri.split('/').pop() || lightboxData.originalUri}
                  </span>
                </div>

                {lightboxData.imageList.length > 1 && (
                  <div className="lightbox-dots-row">
                    {lightboxData.imageList.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`lightbox-dot ${idx === lightboxData.currentIndex ? 'active' : ''}`}
                        onClick={() => {
                          setLightboxData({
                            ...lightboxData,
                            currentIndex: idx,
                            src: item.src,
                            category: item.category,
                            originalUri: item.originalUri,
                          });
                        }}
                        title={`${item.category} (#${idx + 1})`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ErectionDetailPage;
