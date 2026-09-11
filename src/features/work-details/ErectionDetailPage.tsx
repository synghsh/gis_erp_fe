import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ErectionDetailData } from '../../models/workModels';
import { GetErectionDetailService, extractDetailObject } from '../../services/workService';
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
  Maximize,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

export const ErectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ErectionDetailData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await GetErectionDetailService(Number(id));
      const detail = extractDetailObject<ErectionDetailData>(res);
      if (detail) {
        setData(detail);
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

  if (loading) {
    return (
      <div className="work-detail-container">
        <div className="detail-loading-state glass-panel">
          <div className="loading-spinner-large"></div>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Loading Erection Execution Details...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Preparing map topology, material KPIs, and day-wise progress logs.</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
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

  return (
    <div className="work-detail-container">
      {/* Top Nav & Breadcrumb */}
      <div className="detail-top-nav">
        <button
          type="button"
          className="back-link-btn"
          onClick={() => navigate('/work-details/erection')}
        >
          <ArrowLeft size={16} /> Back to Erection List
        </button>

        <div className="detail-actions-group">
          <button
            type="button"
            className="detail-action-btn"
            onClick={fetchDetail}
            title="Refresh Details"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            className="detail-action-btn"
            onClick={() => window.print()}
            title="Print Summary"
          >
            <FileText size={14} /> Print / Export
          </button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="detail-hero-card glass-panel">
        <div className="hero-main-info">
          <div className="hero-tagline">
            <Activity size={14} /> Erection Execution Profile
          </div>
          <h1 className="hero-title">{data.drawing_no || `Execution #${data.id}`}</h1>
          <div className="hero-subtitles">
            <span className="chip">
              <Zap size={14} color="#0ea5e9" /> Feeder: <strong>{data.feeder_name || 'N/A'}</strong>
            </span>
            {data.dtr_code && (
              <span className="chip">
                <Cpu size={14} color="#10b981" /> DTR Code: <strong>{data.dtr_code}</strong>
              </span>
            )}
            <span className="chip">
              <MapPin size={14} color="#f59e0b" /> {data.block_name || 'Block'}, {data.district_name || 'District'}
            </span>
          </div>
        </div>

        <div className="hero-status-badges">
          <div className={`status-pill-large ${data.status === 2 ? 'completed' : 'active'}`}>
            <CheckCircle2 size={16} />
            <span>{data.status_label || (data.status === 2 ? 'Completed' : 'Active')}</span>
          </div>
          <div className="days-badge-large">
            <Clock size={16} />
            <span>{prog.total_working_days} Working Day{prog.total_working_days > 1 ? 's' : ''} ({prog.total_calendar_days} Cal Days)</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION I: Total Material Summary Details in Cards
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Layers size={20} color="#0ea5e9" /> Total Material Summary
          </h2>
          <span className="section-subtitle">Aggregated material quantities installed across entire route</span>
        </div>

        <div className="summary-cards-grid">
          {/* Total Poles Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Total Poles</span>
              <div className="summary-card-icon" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)' }}>
                <Box size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_poles}</div>
            <div className="summary-card-subtext">
              <span className="badge-tag cyan">{mat.new_poles_count} New</span>
              <span className="badge-tag amber">{mat.old_poles_count} Old</span>
            </div>
          </div>

          {/* Total DTRs Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Total DTRs</span>
              <div className="summary-card-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Cpu size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_dtr}</div>
            <div className="summary-card-subtext">
              <span className="badge-tag green">{mat.total_dtr > 0 ? 'Transformers Verified' : 'None'}</span>
            </div>
          </div>

          {/* Conductor Span Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Conductor Span</span>
              <div className="summary-card-icon" style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>
                <Zap size={20} />
              </div>
            </div>
            <div className="summary-card-value">
              {mat.total_route_length_meters >= 1000
                ? `${(mat.total_route_length_meters / 1000).toFixed(2)} km`
                : `${Math.round(mat.total_route_length_meters)} m`}
            </div>
            <div className="summary-card-subtext">
              {mat.conductor_names && mat.conductor_names.length > 0 ? mat.conductor_names.join(', ') : 'ACSR / AB Cable'}
            </div>
          </div>

          {/* Earthing Sets Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Earthing Sets</span>
              <div className="summary-card-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_earthing || 0}</div>
            <div className="summary-card-subtext">Pipe & Coil Earthing Sets</div>
          </div>

          {/* Stay Sets Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Stay Sets</span>
              <div className="summary-card-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                <Activity size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_stay_sets || 0}</div>
            <div className="summary-card-subtext">Guy / Stay Assemblies</div>
          </div>

          {/* Dead End Clamps Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Dead End Clamps</span>
              <div className="summary-card-icon" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}>
                <Layers size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_dead_end_clamps || 0}</div>
            <div className="summary-card-subtext">Tension Anchoring Clamps</div>
          </div>

          {/* Suspension Clamps Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Suspension Clamps</span>
              <div className="summary-card-icon" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)' }}>
                <Layers size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_suspension_clamps || 0}</div>
            <div className="summary-card-subtext">Intermediate Line Clamps</div>
          </div>

          {/* Pole Clamps Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Pole Clamps</span>
              <div className="summary-card-icon" style={{ color: '#64748b', background: 'rgba(100, 116, 139, 0.1)' }}>
                <Layers size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_pole_clamps || 0}</div>
            <div className="summary-card-subtext">Steel Structural Clamps</div>
          </div>

          {/* IPC Quantity Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">IPC Connectors</span>
              <div className="summary-card-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
                <Zap size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_ipc || 0}</div>
            <div className="summary-card-subtext">Insulation Piercing Connectors</div>
          </div>

          {/* Service Connections Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Service Connections</span>
              <div className="summary-card-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_service_connections || 0}</div>
            <div className="summary-card-subtext">Consumer Drop Connections</div>
          </div>

          {/* Pole Distribution Boxes Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Pole DBs</span>
              <div className="summary-card-icon" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}>
                <Box size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_pole_db || 0}</div>
            <div className="summary-card-subtext">
              {mat.pole_db_summary && Object.keys(mat.pole_db_summary).length > 0
                ? Object.entries(mat.pole_db_summary)
                    .map(([type, qty]) => `Type ${type}: ${qty}`)
                    .join(', ')
                : 'Distribution Boxes'}
            </div>
          </div>

          {/* Extra Consumption Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Extra Consumption</span>
              <div className="summary-card-icon" style={{ color: '#eab308', background: 'rgba(234, 179, 8, 0.1)' }}>
                <Activity size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_extra_consumption || 0}</div>
            <div className="summary-card-subtext">Additional Installed Units</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION II: Basic Details + Contractor & Surveyor Details
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <FileText size={20} color="#0ea5e9" /> Project, Contractor & Surveyor Profile
          </h2>
          <span className="section-subtitle">Execution metadata, administrative hierarchy, and field contacts</span>
        </div>

        <div className="meta-details-grid">
          {/* Basic Details Card */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <Zap size={16} color="#0ea5e9" /> Basic Execution Details
            </div>
            <div className="meta-info-list">
              <div className="meta-info-item">
                <span className="meta-label">Drawing / Scheme No</span>
                <span className="meta-value">{data.drawing_no}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Feeder Name</span>
                <span className="meta-value">{data.feeder_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">DTR Code</span>
                <span className="meta-value">{data.dtr_code || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Type of Work</span>
                <span className="meta-value">{data.type_of_work_name || 'Erection Work'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">LT Starting Point</span>
                <span className="meta-value">{data.lt_starting_point_name || 'Substation'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Status</span>
                <span className="meta-value">{data.status_label || (data.status === 2 ? 'Completed' : 'Active')}</span>
              </div>
              <div className="meta-info-item full-width">
                <span className="meta-label">Remarks</span>
                <span className="meta-value">{data.remarks || 'No remarks recorded.'}</span>
              </div>
            </div>
          </div>

          {/* Location Hierarchy Card */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <MapPin size={16} color="#f59e0b" /> Location & Geography
            </div>
            <div className="meta-info-list">
              <div className="meta-info-item">
                <span className="meta-label">State</span>
                <span className="meta-value">{data.state_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">District</span>
                <span className="meta-value">{data.district_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Block</span>
                <span className="meta-value">{data.block_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Village / Locality</span>
                <span className="meta-value">{data.village_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Created On</span>
                <span className="meta-value">{data.created_on || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{data.updated_on || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Contractor & Surveyor Profile */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <User size={16} color="#10b981" /> Contractor & Surveyor Profile
            </div>
            <div className="meta-info-list">
              <div className="meta-info-item full-width">
                <span className="meta-label">Contractor Name</span>
                <span className="meta-value" style={{ fontWeight: 700, fontSize: '15px' }}>
                  {data.contractor_name || 'Unassigned Contractor'}
                </span>
              </div>
              <div className="meta-info-item full-width">
                <span className="meta-label">Surveyor / Supervisor</span>
                <span className="meta-value" style={{ fontWeight: 600 }}>
                  {data.surveyor_name || 'Unassigned'}
                </span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Surveyor Contact</span>
                <span className="meta-value">
                  {data.surveyor_phone ? (
                    <a href={`tel:${data.surveyor_phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {data.surveyor_phone}
                    </a>
                  ) : (
                    'Not Available'
                  )}
                </span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Surveyor Email</span>
                <span className="meta-value">
                  {data.surveyor_email ? (
                    <a href={`mailto:${data.surveyor_email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={12} /> {data.surveyor_email}
                    </a>
                  ) : (
                    'Not Available'
                  )}
                </span>
              </div>
              <div className="meta-info-item full-width">
                <span className="meta-label">Execution Duration</span>
                <span className="meta-value">
                  {prog.start_date && prog.completion_date
                    ? `${prog.start_date} → ${prog.completion_date}`
                    : `${data.created_on?.substring(0, 10) || 'Started'}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION III: Interactive Topology Map (Poles Old/New + DTR + Conductor)
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Zap size={20} color="#0ea5e9" /> Conductor Route & Node Topology Map
          </h2>
          <span className="section-subtitle">
            Poles (distinguishing Old vs New) and DTR nodes connected via conductor with in-between span distances
          </span>
        </div>

        <WorkDetailMap
          nodes={data.nodes || []}
          lineTitle={data.drawing_no || `Execution #${data.id}`}
          height="520px"
        />
      </div>

      {/* =========================================================================
          SECTION IV: Pole & DTR Wise Material Qty along with all images
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Box size={20} color="#0ea5e9" /> Pole & DTR Wise Material Breakdown & Photos
          </h2>
          <span className="section-subtitle">Detailed material quantities and captured field camera photos for each node</span>
        </div>

        <div className="nodes-material-list">
          {data.nodes && data.nodes.length > 0 ? (
            data.nodes.map((node, index) => {
              const isDTR = node.node_type === 'DTR';
              const isNew = node.is_new_pole !== false;

              return (
                <div key={node.id || index} className="node-item-card glass-panel">
                  {/* Node Header */}
                  <div className="node-card-header">
                    <div className="node-header-left">
                      <div className="node-seq-badge">#{node.sequence_number ?? index + 1}</div>
                      <span className="node-name">{node.name_label || `Node ${index + 1}`}</span>
                      <span className={`badge-tag ${isDTR ? 'green' : (isNew ? 'cyan' : 'amber')}`}>
                        {node.structure_condition_label || (isDTR ? 'DTR' : (isNew ? 'NEW POLE' : 'OLD POLE'))}
                      </span>
                    </div>

                    <div className="node-header-right">
                      {node.distance_to_prev_meters > 0 && (
                        <div className="span-dist-pill">
                          Span: {node.distance_to_prev_meters >= 1000 ? (node.distance_to_prev_meters / 1000).toFixed(2) + ' km' : node.distance_to_prev_meters + ' m'}
                        </div>
                      )}
                      <div className="gps-coords-pill">
                        {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  {/* Material Quantities Grid */}
                  <div className="node-materials-grid">
                    {/* Pole / DTR Specification */}
                    {isDTR ? (
                      <>
                        <div className="mat-item">
                          <span className="mat-label">DTR Capacity</span>
                          <span className="mat-val">{node.dtr_capacity_name || node.attributes?.dtrCapacity || 'Standard KVA'}</span>
                        </div>
                        {node.dtr_serial_no && (
                          <div className="mat-item">
                            <span className="mat-label">Serial Number</span>
                            <span className="mat-val">{node.dtr_serial_no}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mat-item">
                          <span className="mat-label">Pole Type</span>
                          <span className="mat-val">{node.pole_type_name || node.attributes?.poleType || 'PCC / RSJ Pole'}</span>
                        </div>
                        <div className="mat-item">
                          <span className="mat-label">Pole Qty</span>
                          <span className="mat-val">{node.pole_qty ?? 1}</span>
                        </div>
                      </>
                    )}

                    {/* Conductor Cable */}
                    <div className="mat-item">
                      <span className="mat-label">Conductor Cable</span>
                      <span className="mat-val">{node.conductor_name || node.attributes?.cableSize || 'ACSR / AB Cable'}</span>
                    </div>

                    {/* Earthing */}
                    <div className="mat-item">
                      <span className="mat-label">Earthing Qty</span>
                      <span className="mat-val">{node.earthing_quantity ?? 0}</span>
                    </div>

                    {/* Stay Set */}
                    <div className="mat-item">
                      <span className="mat-label">Stay Set Qty</span>
                      <span className="mat-val">{node.stay_set_quantity ?? 0}</span>
                    </div>

                    {/* Dead End Clamp */}
                    <div className="mat-item">
                      <span className="mat-label">Dead End Clamps</span>
                      <span className="mat-val">{node.dead_end_clamp_qty ?? 0}</span>
                    </div>

                    {/* Suspension Clamp */}
                    <div className="mat-item">
                      <span className="mat-label">Suspension Clamps</span>
                      <span className="mat-val">{node.suspension_clamp_qty ?? 0}</span>
                    </div>

                    {/* Pole Clamp */}
                    <div className="mat-item">
                      <span className="mat-label">Pole Clamps</span>
                      <span className="mat-val">{node.pole_clamp_qty ?? 0}</span>
                    </div>

                    {/* IPC Quantity */}
                    <div className="mat-item">
                      <span className="mat-label">IPC Connectors</span>
                      <span className="mat-val">{node.ipc_qty ?? 0}</span>
                    </div>

                    {/* Service Connection */}
                    <div className="mat-item">
                      <span className="mat-label">Service Connections</span>
                      <span className="mat-val">{node.service_connection_qty ?? 0}</span>
                    </div>

                    {/* Pole DB */}
                    {node.pole_db_quantities && Object.keys(node.pole_db_quantities).length > 0 && (
                      <div className="mat-item">
                        <span className="mat-label">Pole DBs</span>
                        <span className="mat-val">
                          {Object.entries(node.pole_db_quantities).map(([k, v]) => `T${k}: ${v}`).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Extra Consumption */}
                    {(node.extra_consumption ?? 0) > 0 && (
                      <div className="mat-item">
                        <span className="mat-label">Extra Consumption</span>
                        <span className="mat-val">{node.extra_consumption}</span>
                      </div>
                    )}
                  </div>

                  {/* Node Captured Photos Gallery */}
                  <div className="node-photos-section">
                    <div className="photos-header">
                      <ImageIcon size={14} color="#0ea5e9" /> Captured Photos ({node.images ? node.images.length : 0})
                    </div>

                    {node.images && node.images.length > 0 ? (
                      <div className="node-photo-thumbnails">
                        {node.images.map((imgUri, imgIdx) => {
                          const isLocalFile = imgUri.startsWith('file://');
                          const displaySrc = isLocalFile ? '' : imgUri;

                          return (
                            <div
                              key={imgIdx}
                              className="photo-thumb-wrapper"
                              onClick={() => setSelectedImage(imgUri)}
                              title={isLocalFile ? `Captured Field Photo #${imgIdx + 1}` : 'Click to preview photo'}
                            >
                              {displaySrc ? (
                                <img
                                  src={displaySrc}
                                  alt={`Node photo ${imgIdx + 1}`}
                                  className="photo-thumb-img"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="photo-fallback-icon">
                                  <ImageIcon size={20} />
                                  <span>Field Photo</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-photos-msg">No images uploaded for this node.</div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No pole or DTR nodes recorded for this execution.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION V: Day Wise Erection Progress & Total Erected Days Table
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">
              <Calendar size={20} color="#0ea5e9" /> Day-Wise Erection Progress & Daily Work Logs
            </h2>
            <span className="section-subtitle">
              Daily chronicle of poles erected, DTRs installed, materials entered through the app, and incremental additions
            </span>
          </div>

          <div className="days-badge-large">
            <CheckCircle2 size={16} />
            <span>Total Erected Days: {prog.total_working_days} Day{prog.total_working_days > 1 ? 's' : ''} to Complete</span>
          </div>
        </div>

        <div className="progress-table-wrapper glass-panel">
          <table className="progress-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Day & Date</th>
                <th>Nodes Handled</th>
                <th>Work Details Done Through App</th>
                <th>Materials Installed on this Day</th>
                <th style={{ width: '120px' }}>Span Erected</th>
                <th style={{ width: '100px' }}>Photos Taken</th>
              </tr>
            </thead>
            <tbody>
              {data.day_wise_progress && data.day_wise_progress.length > 0 ? (
                data.day_wise_progress.map((day) => (
                  <tr key={day.day_number}>
                    <td>
                      <div className="day-cell">
                        <span className="day-number">Day {day.day_number}</span>
                        <span className="day-date">{day.date}</span>
                      </div>
                    </td>
                    <td>
                      <div className="nodes-chip-list">
                        {day.nodes_summary && day.nodes_summary.length > 0 ? (
                          day.nodes_summary.map((ns, nsIdx) => {
                            const isOld = ns.includes('OLD') || ns.includes('Old');
                            const isDTR = ns.includes('DTR');
                            return (
                              <span
                                key={nsIdx}
                                className={`node-chip ${isDTR ? 'dtr' : (isOld ? 'old' : 'new')}`}
                              >
                                {ns}
                              </span>
                            );
                          })
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Material Update</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#ffffff' }}>{day.work_description}</strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{day.materials_summary}</span>
                    </td>
                    <td>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                        {day.span_meters >= 1000 ? `${(day.span_meters / 1000).toFixed(2)} km` : `${Math.round(day.span_meters)} m`}
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag cyan">{day.photos_count} photo{day.photos_count !== 1 ? 's' : ''}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No day-wise entries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <span>Field Photo Preview</span>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="lightbox-image-container">
              {selectedImage.startsWith('file://') ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={48} style={{ marginBottom: '12px' }} />
                  <h4>Local App Photo Cached on Device</h4>
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: '8px', wordBreak: 'break-all' }}>
                    {selectedImage}
                  </p>
                </div>
              ) : (
                <img src={selectedImage} alt="Enlarged field camera preview" className="lightbox-img" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErectionDetailPage;
