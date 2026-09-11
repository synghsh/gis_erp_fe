import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ErectionNodeDetail, SurveyNodeDetail } from '../../models/workModels';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';

interface WorkDetailMapProps {
  nodes: (ErectionNodeDetail | SurveyNodeDetail)[];
  lineTitle: string;
  height?: string;
  defaultZoom?: number;
}

export const WorkDetailMap: React.FC<WorkDetailMapProps> = ({
  nodes,
  lineTitle,
  height = '480px',
  defaultZoom = 14,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineGroupRef = useRef<L.LayerGroup | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid multiple initializations
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron / OSM tiles for crisp, clean look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
        .addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      polylineGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers
    if (markersGroupRef.current) markersGroupRef.current.clearLayers();
    if (polylineGroupRef.current) polylineGroupRef.current.clearLayers();

    // Filter valid coordinates
    const validNodes = nodes.filter(
      (n) =>
        n.latitude !== 0 &&
        n.longitude !== 0 &&
        !isNaN(n.latitude) &&
        !isNaN(n.longitude)
    );

    if (validNodes.length === 0) {
      map.setView([22.5726, 88.3639], defaultZoom);
      return;
    }

    const latLngs: L.LatLngExpression[] = [];

    validNodes.forEach((node, index) => {
      const latLng: [number, number] = [node.latitude, node.longitude];
      latLngs.push(latLng);

      const isDTR = node.node_type === 'DTR';
      const isNew = node.is_new_pole !== false;

      // Custom DivIcon
      let markerClass = 'marker-new-pole';
      let badgeText = 'NEW';
      let iconSymbol = '📍';

      if (isDTR) {
        markerClass = isNew ? 'marker-dtr-new' : 'marker-dtr-old';
        badgeText = isNew ? 'DTR (NEW)' : 'DTR (OLD)';
        iconSymbol = '⚡';
      } else if (!isNew) {
        markerClass = 'marker-old-pole';
        badgeText = 'OLD';
        iconSymbol = '🪵';
      } else {
        markerClass = 'marker-new-pole';
        badgeText = 'NEW';
        iconSymbol = '⚡';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker-wrapper',
        html: `
          <div class="custom-node-marker ${markerClass}">
            <div class="marker-pulse"></div>
            <div class="marker-content">
              <span class="marker-icon">${iconSymbol}</span>
              <span class="marker-title">${node.name_label || `Node ${index + 1}`}</span>
            </div>
            <span class="marker-status-badge">${badgeText}</span>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 48],
        popupAnchor: [0, -48],
      });

      // Create popup content
      const conductorInfo = ('conductor_name' in node && node.conductor_name)
        ? node.conductor_name
        : (node.attributes?.cableSize || 'ACSR / AB Cable');

      const distInfo = node.distance_to_prev_meters > 0
        ? `${node.distance_to_prev_meters >= 1000 ? (node.distance_to_prev_meters / 1000).toFixed(2) + ' km' : node.distance_to_prev_meters + ' m'}`
        : (index === 0 ? 'Starting Point (0 m)' : '0 m');

      const photosCount = node.images ? node.images.length : 0;

      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-header ${markerClass}">
            <span class="popup-title">${node.name_label}</span>
            <span class="popup-badge">${node.structure_condition_label || (isDTR ? 'Transformer' : (isNew ? 'New Pole' : 'Old Pole'))}</span>
          </div>
          <div class="map-popup-body">
            <div class="popup-row">
              <span class="popup-label">Sequence:</span>
              <span class="popup-value">#${node.sequence_number ?? index + 1}</span>
            </div>
            <div class="popup-row">
              <span class="popup-label">Conductor:</span>
              <span class="popup-value">${conductorInfo}</span>
            </div>
            <div class="popup-row">
              <span class="popup-label">Span Distance:</span>
              <span class="popup-value highlight">${distInfo}</span>
            </div>
            <div class="popup-row">
              <span class="popup-label">GPS Lat/Lng:</span>
              <span class="popup-value mono">${node.latitude.toFixed(6)}, ${node.longitude.toFixed(6)}</span>
            </div>
            ${photosCount > 0 ? `
            <div class="popup-row">
              <span class="popup-label">Photos:</span>
              <span class="popup-value">${photosCount} captured</span>
            </div>` : ''}
          </div>
        </div>
      `;

      const marker = L.marker(latLng, { icon: customIcon });
      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
      markersGroupRef.current?.addLayer(marker);

      // Distance indicator on segment midpoint
      if (index > 0) {
        const prevNode = validNodes[index - 1];
        const midLat = (prevNode.latitude + node.latitude) / 2;
        const midLng = (prevNode.longitude + node.longitude) / 2;
        const dist = node.distance_to_prev_meters;

        if (dist > 0) {
          const distLabel = dist >= 1000
            ? `${(dist / 1000).toFixed(2)} km`
            : `${Math.round(dist)} m`;

          const distanceIcon = L.divIcon({
            className: 'custom-distance-badge-wrapper',
            html: `<div class="distance-pill" title="Span: ${prevNode.name_label} → ${node.name_label}">${distLabel}</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });

          const distMarker = L.marker([midLat, midLng], {
            icon: distanceIcon,
            interactive: true,
          });
          distMarker.bindTooltip(
            `<strong>Span Length:</strong> ${distLabel}<br><span style="color:#64748b;">${prevNode.name_label} &rarr; ${node.name_label}</span>`,
            { direction: 'top', offset: [0, -10] }
          );
          markersGroupRef.current?.addLayer(distMarker);
        }
      }
    });

    // Draw Conductor Polyline connecting all nodes
    if (latLngs.length > 1) {
      // Glow polyline
      const glowLine = L.polyline(latLngs, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      });
      polylineGroupRef.current?.addLayer(glowLine);

      // Core conductor polyline
      const coreLine = L.polyline(latLngs, {
        color: '#0ea5e9',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '6, 8',
      });
      polylineGroupRef.current?.addLayer(coreLine);
    }

    // Fit map view to encompass all nodes
    const bounds = L.latLngBounds(latLngs);
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 17,
      });
    }

    // Trigger resize after small delay
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [nodes, defaultZoom]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    const validNodes = nodes.filter(
      (n) => n.latitude !== 0 && n.longitude !== 0 && !isNaN(n.latitude)
    );
    if (validNodes.length > 0) {
      const bounds = L.latLngBounds(
        validNodes.map((n) => [n.latitude, n.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 17,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`work-detail-map-wrapper ${isFullscreen ? 'map-fullscreen-mode' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map Header Overlay */}
      <div className="map-top-bar">
        <div className="map-title-chip">
          <Navigation size={14} className="icon-pulse" />
          <span>{lineTitle} &bull; Route Map</span>
          <span className="nodes-pill">{nodes.length} Nodes</span>
        </div>

        {/* Floating Map Controls */}
        <div className="map-controls-group">
          <button
            type="button"
            className="map-control-btn"
            onClick={handleFitBounds}
            title="Fit to All Nodes"
          >
            <Compass size={16} />
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="map-leaflet-container" />

      {/* Interactive Legend Overlay */}
      <div className="map-legend-panel">
        <div className="legend-item">
          <span className="legend-indicator new-pole"></span>
          <span>New Pole</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator old-pole"></span>
          <span>Old Pole</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator dtr"></span>
          <span>DTR Node</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator conductor"></span>
          <span>Conductor Line</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator distance"></span>
          <span>In-between Span</span>
        </div>
      </div>
    </div>
  );
};
