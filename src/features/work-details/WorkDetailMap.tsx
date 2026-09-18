import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ErectionNodeDetail, SurveyNodeDetail } from '../../models/workModels';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Compass, Search, Layers, Navigation, Zap, Box, Cpu } from 'lucide-react';

interface WorkDetailMapProps {
  nodes: (ErectionNodeDetail | SurveyNodeDetail)[];
  lineTitle: string;
  height?: string;
  defaultZoom?: number;
  totalRouteLengthMeters?: number;
  totalPoles?: number;
  totalDtrs?: number;
}

export const WorkDetailMap: React.FC<WorkDetailMapProps> = ({
  nodes,
  lineTitle,
  height = '480px',
  defaultZoom = 14,
  totalRouteLengthMeters,
  totalPoles,
  totalDtrs,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineGroupRef = useRef<L.LayerGroup | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Computed fallbacks if props not passed explicitly
  const poleCount = totalPoles ?? nodes.filter((n) => n.node_type === 'POLE').length;
  const dtrCount = totalDtrs ?? nodes.filter((n) => n.node_type === 'DTR').length;
  const routeLengthM = totalRouteLengthMeters ?? nodes.reduce((acc, n) => acc + (n.distance_to_prev_meters || 0), 0);
  const routeLengthStr = routeLengthM >= 1000 ? `${(routeLengthM / 1000).toFixed(2)} km` : `${Math.round(routeLengthM)} m`;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid multiple initializations
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager tiles for crisp, clean map
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

      // Clean circle dot marker matching screenshot
      let dotColor = '#2563eb'; // blue for new pole
      let dotBorder = '#ffffff';
      let markerTypeClass = 'marker-dot-new-pole';
      let badgeLabel = 'New Pole';

      if (isDTR) {
        dotColor = '#10b981'; // green for DTR
        markerTypeClass = 'marker-dot-dtr';
        badgeLabel = 'DTR Node';
      } else if (!isNew) {
        dotColor = '#f59e0b'; // amber/orange for old pole
        markerTypeClass = 'marker-dot-old-pole';
        badgeLabel = 'Old Pole';
      }

      const customIcon = L.divIcon({
        className: 'topology-node-icon-wrapper',
        html: `
          <div class="topology-pin ${markerTypeClass}" style="--pin-color: ${dotColor};">
            <div class="pin-ring"></div>
            <div class="pin-dot">
              ${isDTR ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' : ''}
            </div>
            <span class="pin-label">${node.name_label || `N${index + 1}`}</span>
          </div>
        `,
        iconSize: [60, 40],
        iconAnchor: [30, 20],
        popupAnchor: [0, -22],
      });

      // Conductor info
      const conductorInfo = ('conductor_name' in node && node.conductor_name)
        ? node.conductor_name
        : (node.attributes?.cableSize || '-');

      const distInfo = node.distance_to_prev_meters > 0
        ? `${node.distance_to_prev_meters >= 1000 ? (node.distance_to_prev_meters / 1000).toFixed(2) + ' km' : Math.round(node.distance_to_prev_meters) + ' m'}`
        : (index === 0 ? 'Starting Point' : '0 m');

      // Styled popup matching screenshot tooltip
      const popupHtml = `
        <div class="topology-map-popup">
          <div class="popup-bubble-header ${isDTR ? 'dtr-header' : (isNew ? 'new-header' : 'old-header')}">
            <div class="popup-title-row">
              <strong>${node.name_label}</strong>
              <span class="popup-type-tag">${badgeLabel}</span>
            </div>
            <div class="popup-cable-sub">${conductorInfo}</div>
          </div>
          <div class="popup-bubble-body">
            <div class="popup-stat-row">
              <span>Sequence:</span>
              <strong>#${node.sequence_number ?? index + 1}</strong>
            </div>
            <div class="popup-stat-row">
              <span>Span to Prev:</span>
              <strong style="color:#0ea5e9;">${distInfo}</strong>
            </div>
            <div class="popup-stat-row">
              <span>GPS:</span>
              <span class="popup-mono">${node.latitude.toFixed(6)}, ${node.longitude.toFixed(6)}</span>
            </div>
            ${isDTR && ('dtr_capacity_name' in node && node.dtr_capacity_name) ? `
            <div class="popup-stat-row">
              <span>Capacity:</span>
              <strong>${node.dtr_capacity_name}</strong>
            </div>` : ''}
          </div>
        </div>
      `;

      const marker = L.marker(latLng, { icon: customIcon });
      marker.bindPopup(popupHtml, { className: 'custom-topology-popup' });
      markersGroupRef.current?.addLayer(marker);

      // Distance pill between nodes on map
      if (index > 0 && node.distance_to_prev_meters > 0) {
        const prevNode = validNodes[index - 1];
        const midLat = (prevNode.latitude + node.latitude) / 2;
        const midLng = (prevNode.longitude + node.longitude) / 2;
        const dist = node.distance_to_prev_meters;
        const distLabel = dist >= 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`;

        const distanceIcon = L.divIcon({
          className: 'custom-span-pill-wrapper',
          html: `<div class="span-map-badge">${distLabel}</div>`,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        });

        const distMarker = L.marker([midLat, midLng], {
          icon: distanceIcon,
          interactive: false,
        });
        markersGroupRef.current?.addLayer(distMarker);
      }
    });

    // Conductor Polyline (Solid line + subtle glow matching screenshot)
    if (latLngs.length > 1) {
      // Glow polyline
      const glowLine = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round',
      });
      polylineGroupRef.current?.addLayer(glowLine);

      // Core conductor polyline
      const coreLine = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.95,
      });
      polylineGroupRef.current?.addLayer(coreLine);
    }

    // Fit map view
    const bounds = L.latLngBounds(latLngs);
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 17,
      });
    }

    // Resize after render
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
        padding: [60, 60],
        maxZoom: 17,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  return (
    <div
      className={`work-detail-map-wrapper ${isFullscreen ? 'map-fullscreen-mode' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Left Compass Rose Widget */}
      <div className="map-compass-badge" title="North orientation">
        <div className="compass-needle">▲</div>
        <span className="compass-letter">N</span>
      </div>

      {/* Floating Action Controls on Top Right */}
      <div className="map-floating-controls">
        <button
          type="button"
          className="map-round-btn"
          onClick={handleFitBounds}
          title="Reset to Fit All Nodes"
        >
          <Search size={15} />
        </button>
        <button
          type="button"
          className="map-round-btn"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <button
          type="button"
          className="map-round-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          className="map-round-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="map-leaflet-container" />

      {/* Bottom-Left Floating Stats Overlay Widget */}
      <div className="map-bottom-stats-card">
        <div className="map-stat-col">
          <div className="stat-col-icon cyan">
            <Zap size={14} />
          </div>
          <div className="stat-col-info">
            <span className="stat-col-label">Route Length</span>
            <span className="stat-col-val">{routeLengthStr}</span>
          </div>
        </div>

        <div className="stat-col-divider" />

        <div className="map-stat-col">
          <div className="stat-col-icon blue">
            <Box size={14} />
          </div>
          <div className="stat-col-info">
            <span className="stat-col-label">Poles</span>
            <span className="stat-col-val">{poleCount}</span>
          </div>
        </div>

        <div className="stat-col-divider" />

        <div className="map-stat-col">
          <div className="stat-col-icon green">
            <Cpu size={14} />
          </div>
          <div className="stat-col-info">
            <span className="stat-col-label">DTRs</span>
            <span className="stat-col-val">{dtrCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailMap;
