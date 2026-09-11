import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { SurveyDetailData } from '../../models/workModels';
import { GetSurveyDetailService, extractDetailObject } from '../../services/workService';
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
  CheckCircle2,
  RefreshCw,
  Box,
  Cpu,
  Image as ImageIcon,
  Activity,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';

export const SurveyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SurveyDetailData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await GetSurveyDetailService(Number(id));
      const detail = extractDetailObject<SurveyDetailData>(res);
      if (detail) {
        setData(detail);
      } else {
        setError('Survey line details could not be found.');
      }
    } catch (err: any) {
      console.error('Error fetching survey details:', err);
      setError(err?.response?.data?.Message || 'Failed to load survey details.');
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
          <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Loading Survey Line Details...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Preparing map coordinates, conductor route, and survey progress logs.</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="work-detail-container">
        <div className="detail-error-state glass-panel">
          <AlertCircle size={48} color="#ef4444" />
          <h3 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>Unable to Load Survey Details</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error || 'Record not found'}</p>
          <button type="button" className="back-link-btn" onClick={() => navigate('/work-details/survey')} style={{ marginTop: '16px' }}>
            <ArrowLeft size={16} /> Back to Survey Listing
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
          onClick={() => navigate('/work-details/survey')}
        >
          <ArrowLeft size={16} /> Back to Survey List
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
            <Activity size={14} /> Survey Line Profile
          </div>
          <h1 className="hero-title">{data.contractor_name || `Survey Line #${data.id}`}</h1>
          <div className="hero-subtitles">
            <span className="chip">
              <Zap size={14} color="#0ea5e9" /> Line Type: <strong>{data.line_type_display || data.line_type}</strong>
            </span>
            <span className="chip">
              <Zap size={14} color="#10b981" /> Feeder: <strong>{data.feeder_name || 'N/A'}</strong>
            </span>
            <span className="chip">
              <MapPin size={14} color="#f59e0b" /> {data.block_name || 'Block'}, {data.district_name || 'District'}
            </span>
          </div>
        </div>

        <div className="hero-status-badges">
          <div className={`status-pill-large ${data.status === 1 ? 'active' : 'completed'}`}>
            <CheckCircle2 size={16} />
            <span>{data.status_label || (data.status === 1 ? 'Active' : 'Archived')}</span>
          </div>
          <div className="days-badge-large">
            <Clock size={16} />
            <span>{prog.total_working_days} Survey Day{prog.total_working_days > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION I: Total Material Summary Details in Cards
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Layers size={20} color="#0ea5e9" /> Survey Material & Route Summary
          </h2>
          <span className="section-subtitle">Aggregated survey assets and route length</span>
        </div>

        <div className="summary-cards-grid">
          {/* Total Poles Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Surveyed Poles</span>
              <div className="summary-card-icon" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)' }}>
                <Box size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_poles}</div>
            <div className="summary-card-subtext">
              <span className="badge-tag cyan">{mat.new_poles_count} New</span>
              <span className="badge-tag amber">{mat.old_poles_count} Existing</span>
            </div>
          </div>

          {/* Total DTRs Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Surveyed DTRs</span>
              <div className="summary-card-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Cpu size={20} />
              </div>
            </div>
            <div className="summary-card-value">{mat.total_dtr}</div>
            <div className="summary-card-subtext">
              <span className="badge-tag green">{mat.total_dtr > 0 ? 'Distribution Transformers' : 'No Transformers'}</span>
            </div>
          </div>

          {/* Total Route Length */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Total Route Length</span>
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
              {mat.conductor_names && mat.conductor_names.length > 0
                ? mat.conductor_names.join(', ')
                : data.line_type_display}
            </div>
          </div>

          {/* Line Type Card */}
          <div className="summary-card glass-panel">
            <div className="summary-card-header">
              <span className="summary-card-title">Line Voltage Type</span>
              <div className="summary-card-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                <Activity size={20} />
              </div>
            </div>
            <div className="summary-card-value" style={{ fontSize: '18px' }}>
              {data.line_type_display}
            </div>
            <div className="summary-card-subtext">
              <span>Code: {data.line_type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION II: Contractor, Surveyor & Location Details
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <FileText size={20} color="#0ea5e9" /> Basic, Contractor & Surveyor Profile
          </h2>
          <span className="section-subtitle">Survey administration, field crew contacts, and geographical location</span>
        </div>

        <div className="meta-details-grid">
          {/* Basic Line Info */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <Zap size={16} color="#0ea5e9" /> Survey Line Details
            </div>
            <div className="meta-info-list">
              <div className="meta-info-item">
                <span className="meta-label">Line ID</span>
                <span className="meta-value">#{data.id}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Line Type</span>
                <span className="meta-value">{data.line_type_display}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Feeder Name</span>
                <span className="meta-value">{data.feeder_name || 'N/A'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Status</span>
                <span className="meta-value">{data.status_label}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Sync Status</span>
                <span className="meta-value">{data.is_synced ? 'Synced' : 'Pending Sync'}</span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Total Nodes</span>
                <span className="meta-value">{data.nodes_count} Nodes</span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <MapPin size={16} color="#f59e0b" /> Location & Hierarchy
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
                <span className="meta-label">Created On</span>
                <span className="meta-value">{data.created_on || 'N/A'}</span>
              </div>
              <div className="meta-info-item full-width">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{data.updated_on || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Contractor & Surveyor Info */}
          <div className="meta-panel-card glass-panel">
            <div className="meta-card-title">
              <User size={16} color="#10b981" /> Contractor & Surveyor Profile
            </div>
            <div className="meta-info-list">
              <div className="meta-info-item full-width">
                <span className="meta-label">Contractor Name</span>
                <span className="meta-value" style={{ fontWeight: 700, fontSize: '15px' }}>
                  {data.contractor_name || 'Unassigned'}
                </span>
              </div>
              <div className="meta-info-item full-width">
                <span className="meta-label">Field Surveyor</span>
                <span className="meta-value" style={{ fontWeight: 600 }}>
                  {data.surveyor_name || 'Unassigned'}
                </span>
              </div>
              <div className="meta-info-item">
                <span className="meta-label">Phone</span>
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
                <span className="meta-label">Email</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION III: Whole Map
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Zap size={20} color="#0ea5e9" /> Survey Route & Node Map
          </h2>
          <span className="section-subtitle">
            Poles and DTRs connected with conductor polyline showing in-between distance
          </span>
        </div>

        <WorkDetailMap
          nodes={data.nodes || []}
          lineTitle={data.contractor_name || `Survey Line #${data.id}`}
          height="520px"
        />
      </div>

      {/* =========================================================================
          SECTION IV: Pole and DTR Wise Node Inspection & Photos
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <h2 className="section-title">
            <Box size={20} color="#0ea5e9" /> Pole & DTR Nodes Inspection
          </h2>
          <span className="section-subtitle">Individual node attributes, conductor specs, and field photos</span>
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

                  {/* Attributes Grid */}
                  <div className="node-materials-grid">
                    <div className="mat-item">
                      <span className="mat-label">Pole / Structure Type</span>
                      <span className="mat-val">{node.attributes?.poleType || (isDTR ? 'Transformer Platform' : 'Standard Pole')}</span>
                    </div>
                    <div className="mat-item">
                      <span className="mat-label">Conductor / Cable Size</span>
                      <span className="mat-val">{node.attributes?.cableSize || data.line_type_display}</span>
                    </div>
                    {node.attributes?.height && (
                      <div className="mat-item">
                        <span className="mat-label">Height</span>
                        <span className="mat-val">{node.attributes.height}</span>
                      </div>
                    )}
                    {node.attributes?.sag && (
                      <div className="mat-item">
                        <span className="mat-label">Sag</span>
                        <span className="mat-val">{node.attributes.sag}</span>
                      </div>
                    )}
                    {node.attributes?.tilt && (
                      <div className="mat-item">
                        <span className="mat-label">Tilt</span>
                        <span className="mat-val">{node.attributes.tilt}</span>
                      </div>
                    )}
                    {node.attributes?.dtrCapacity && (
                      <div className="mat-item">
                        <span className="mat-label">DTR Capacity</span>
                        <span className="mat-val">{node.attributes.dtrCapacity}</span>
                      </div>
                    )}
                  </div>

                  {/* Captured Photos */}
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
                                  alt={`Survey photo ${imgIdx + 1}`}
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
                      <div className="no-photos-msg">No images captured for this node.</div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No survey nodes recorded for this line.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION V: Day-Wise Progress Table
          ========================================================================= */}
      <div className="detail-section">
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">
              <Calendar size={20} color="#0ea5e9" /> Day-Wise Survey Progress
            </h2>
            <span className="section-subtitle">Chronological record of nodes surveyed through the mobile application</span>
          </div>

          <div className="days-badge-large">
            <CheckCircle2 size={16} />
            <span>Total Survey Days: {prog.total_working_days} Day{prog.total_working_days > 1 ? 's' : ''} to Complete</span>
          </div>
        </div>

        <div className="progress-table-wrapper glass-panel">
          <table className="progress-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Day & Date</th>
                <th>Nodes Handled</th>
                <th>Work Details Done Through App</th>
                <th>Summary of Assets Mapped</th>
                <th style={{ width: '120px' }}>Span Covered</th>
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
                          <span style={{ color: 'var(--text-muted)' }}>Survey update</span>
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <span>Survey Photo Preview</span>
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

export default SurveyDetailPage;
