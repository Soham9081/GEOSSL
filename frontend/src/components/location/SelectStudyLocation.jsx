import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, RotateCcw, Info, Layers, Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default Study Region: Raigad District, Maharashtra
export const DEFAULT_RAIGAD_REGION = {
  id: "selected-region",
  name: "Raigad",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [72.85, 17.85],
        [73.55, 17.85],
        [73.55, 19.15],
        [72.85, 19.15],
        [72.85, 17.85]
      ]
    ]
  },
  bbox: [72.85, 17.85, 73.55, 19.15],
  centroid: {
    lat: 18.5158,
    lon: 73.1822
  }
};

export default function SelectStudyLocation({ initialRegion, onContinue }) {
  const [selectedRegion, setSelectedRegion] = useState(initialRegion || DEFAULT_RAIGAD_REGION);
  const [isDrawing, setIsDrawing] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const rectLayerRef = useRef(null);
  const markerLayerRef = useRef(null);
  const isDrawingStateRef = useRef(false);
  const drawStartLatLngRef = useRef(null);

  // Sync ref with drawing state for event handlers
  useEffect(() => {
    isDrawingStateRef.current = isDrawing;
  }, [isDrawing]);

  // Update study region state helper
  const updateRegionFromBounds = (southWest, northEast, customName = null) => {
    const minLat = Number(Math.min(southWest.lat, northEast.lat).toFixed(4));
    const maxLat = Number(Math.max(southWest.lat, northEast.lat).toFixed(4));
    const minLon = Number(Math.min(southWest.lng, northEast.lng).toFixed(4));
    const maxLon = Number(Math.max(southWest.lng, northEast.lng).toFixed(4));

    const centerLat = Number(((minLat + maxLat) / 2).toFixed(4));
    const centerLon = Number(((minLon + maxLon) / 2).toFixed(4));

    const name = customName || "Selected Study Area";

    const newRegion = {
      id: "selected-region",
      name: name,
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [minLon, minLat],
            [maxLon, minLat],
            [maxLon, maxLat],
            [minLon, maxLat],
            [minLon, minLat]
          ]
        ]
      },
      bbox: [minLon, minLat, maxLon, maxLat],
      centroid: {
        lat: centerLat,
        lon: centerLon
      }
    };

    setSelectedRegion(newRegion);
    return newRegion;
  };

  // Function to render bounding box and centroid marker on Leaflet map
  const renderOverlays = (region) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const [minLon, minLat, maxLon, maxLat] = region.bbox;
    const bounds = L.latLngBounds([minLat, minLon], [maxLat, maxLon]);

    if (rectLayerRef.current) {
      rectLayerRef.current.setBounds(bounds);
    } else {
      rectLayerRef.current = L.rectangle(bounds, {
        color: '#065f46',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.18,
        dashArray: '4, 4'
      }).addTo(map);
    }

    const centroidLatLng = [region.centroid.lat, region.centroid.lon];
    if (markerLayerRef.current) {
      markerLayerRef.current.setLatLng(centroidLatLng);
    } else {
      const customIcon = L.divIcon({
        className: 'custom-centroid-marker',
        html: `<div style="
          width: 14px;
          height: 14px;
          background: #047857;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      markerLayerRef.current = L.marker(centroidLatLng, { icon: customIcon }).addTo(map);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Defensive: destroy any pre-existing Leaflet instance on this container
    // (React 18 Strict Mode runs effects twice; also guards re-mount)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      rectLayerRef.current = null;
      markerLayerRef.current = null;
    }
    // Also destroy any Leaflet instance left on the DOM node itself
    if (mapContainerRef.current._leaflet_id != null) {
      try { mapContainerRef.current._leaflet_id = null; } catch(_) {}
    }

    const initialCentroid = selectedRegion.centroid;
    const map = L.map(mapContainerRef.current, {
      center: [initialCentroid.lat, initialCentroid.lon],
      zoom: 9,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abc',
      maxZoom: 19,
    }).addTo(map);

    // Initial overlays
    renderOverlays(selectedRegion);

    // Interaction handlers
    map.on('mousedown', (e) => {
      if (!isDrawingStateRef.current) return;
      map.dragging.disable();
      drawStartLatLngRef.current = e.latlng;
      const bounds = L.latLngBounds(e.latlng, e.latlng);
      if (rectLayerRef.current) rectLayerRef.current.setBounds(bounds);
    });

    map.on('mousemove', (e) => {
      if (!isDrawingStateRef.current || !drawStartLatLngRef.current) return;
      const bounds = L.latLngBounds(drawStartLatLngRef.current, e.latlng);
      if (rectLayerRef.current) {
        rectLayerRef.current.setBounds(bounds);
      }
    });

    map.on('mouseup', (e) => {
      if (!isDrawingStateRef.current || !drawStartLatLngRef.current) return;
      const start = drawStartLatLngRef.current;
      const end = e.latlng;
      drawStartLatLngRef.current = null;
      map.dragging.enable();
      setIsDrawing(false);

      // If rectangle is very tiny (just a click), do a default 0.5 deg bbox around click
      if (Math.abs(start.lat - end.lat) < 0.02 && Math.abs(start.lng - end.lng) < 0.02) {
        const sw = { lat: end.lat - 0.25, lng: end.lng - 0.25 };
        const ne = { lat: end.lat + 0.25, lng: end.lng + 0.25 };
        const newReg = updateRegionFromBounds(sw, ne);
        renderOverlays(newReg);
      } else {
        const newReg = updateRegionFromBounds(start, end);
        renderOverlays(newReg);
      }
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      rectLayerRef.current = null;
      markerLayerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // Reset to default Raigad Region
  const handleResetDefault = () => {
    setSelectedRegion(DEFAULT_RAIGAD_REGION);
    setIsDrawing(false);
    if (mapInstanceRef.current) {
      renderOverlays(DEFAULT_RAIGAD_REGION);
      const [minLon, minLat, maxLon, maxLat] = DEFAULT_RAIGAD_REGION.bbox;
      mapInstanceRef.current.fitBounds([
        [minLat, minLon],
        [maxLat, maxLon]
      ], { padding: [30, 30] });
    }
  };

  const toggleDrawMode = () => {
    setIsDrawing(prev => !prev);
  };

  const handleContinue = () => {
    if (!selectedRegion || !selectedRegion.bbox) return;
    if (onContinue) {
      onContinue(selectedRegion);
    }
  };

  const [minLon, minLat, maxLon, maxLat] = selectedRegion.bbox;

  return (
    <section id="select-location" className="section" style={{ background: 'var(--bg-page)', minHeight: 'calc(100vh - 180px)' }}>
      <div className="container">

        {/* Section Header */}
        <div className="section-header">
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
            Step 1 • Study Area Configuration
          </span>
          <h1 className="section-title">Select Study Location</h1>
          <p className="section-subtitle">
            Choose your geographical region of interest. Select a rectangular area on the map or use the default Raigad District boundary.
          </p>
        </div>

        {/* Main Grid: Interactive Map + Location Metadata Sidebar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '1.5rem',
          alignItems: 'start',
          marginBottom: '2rem'
        }} className="select-location-layout">
          {/* Map Container Card */}
          <div className="card-clean" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Map Action Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.875rem 1.25rem',
              background: '#ffffff',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-950)' }}>
                <Layers size={18} color="var(--primary-700)" />
                <span>Interactive Map Viewer</span>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>OpenStreetMap / Voyager</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  id="btn-draw-rect"
                  onClick={toggleDrawMode}
                  className={`btn btn-sm ${isDrawing ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    backgroundColor: isDrawing ? 'var(--primary-800)' : '#ffffff',
                    color: isDrawing ? '#ffffff' : 'var(--primary-900)'
                  }}
                  title="Click and drag on the map to define a new bounding box"
                >
                  <Crosshair size={15} />
                  <span>{isDrawing ? 'Click & Drag to Box' : 'Draw Study Area'}</span>
                </button>

                <button
                  id="btn-reset-raigad"
                  onClick={handleResetDefault}
                  className="btn btn-secondary btn-sm"
                  title="Reset to Raigad District default coordinates"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {/* Instruction Banner if drawing */}
            {isDrawing && (
              <div style={{
                background: 'var(--primary-50)',
                borderBottom: '1px solid var(--primary-100)',
                color: 'var(--primary-900)',
                padding: '0.5rem 1.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Info size={16} color="var(--primary-700)" />
                <span><strong>Draw Mode Active:</strong> Click and drag on the map surface to select your custom rectangular study region.</span>
              </div>
            )}

            {/* Leaflet Map element */}
            {/* Map container with error handling */}
            <div
              ref={mapContainerRef}
              id="study-area-map"
              style={{
                width: '100%',
                height: '520px',
                cursor: isDrawing ? 'crosshair' : 'grab',
                backgroundColor: '#e5e7eb'
              }}
            />
          </div>

          {/* Selected Location Information Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card-clean">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  background: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-950)' }}>
                    Selected Location
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    GeoSSL Study Region Specification
                  </span>
                </div>
              </div>

              {/* 1. Location Name */}
              <div style={{ marginBottom: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.2rem' }}>
                  Location Name
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  {selectedRegion.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {selectedRegion.name.includes('Raigad') ? 'Maharashtra, Western Ghats / Coastal Zone' : 'User-defined study bounding box'}
                </div>
              </div>

              {/* 2. Centroid */}
              <div style={{ marginBottom: '1rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
                  Centroid
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ background: 'var(--bg-page)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Latitude</span>
                    <span className="mono" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {selectedRegion.centroid.lat}° N
                    </span>
                  </div>
                  <div style={{ background: 'var(--bg-page)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Longitude</span>
                    <span className="mono" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {selectedRegion.centroid.lon}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Bounding Box Coordinates */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
                  Bounding Box Coordinates [W, S, E, N]
                </div>
                <div style={{
                  background: 'var(--bg-page)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Min Lon (West):</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{minLon}°</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Min Lat (South):</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{minLat}°</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Max Lon (East):</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{maxLon}°</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Max Lat (North):</span>
                    <span className="mono" style={{ fontWeight: 600 }}>{maxLat}°</span>
                  </div>
                </div>
              </div>

              {/* Continue to Analysis Button */}
              <button
                id="btn-continue-analysis"
                onClick={handleContinue}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span>Continue to Analysis</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Note info box */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <Info size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                Selected region metadata will be preserved and carried over to the multi-temporal <strong>Satellite Comparison</strong> view.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
