import React, { useState, useRef, useEffect } from 'react';
import { Columns, SplitSquareVertical, Eye, Image as ImageIcon } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';
import SensorInfoBar from './SensorInfoBar';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function ImageViewer({ baseYearData, targetYearData, baseYear = 2018, targetYear = 2024 }) {
  const [viewMode, setViewMode] = useState('swipe'); // 'side-by-side' or 'swipe'
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for swipe
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div className="card-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.05rem' }}>Multi-Temporal Satellite Comparison Viewer</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Inspect Sentinel-2 acquisitions for Raigad District: Baseline {baseYear} vs Target {targetYear}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('swipe')}
            className="btn-outline"
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.775rem',
              backgroundColor: viewMode === 'swipe' ? 'var(--primary-50)' : '#fff',
              borderColor: viewMode === 'swipe' ? 'var(--primary-600)' : 'var(--border-strong)',
              color: viewMode === 'swipe' ? 'var(--primary-900)' : 'var(--text-main)'
            }}
          >
            <SplitSquareVertical size={14} />
            <span>Interactive Swipe</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className="btn-outline"
            style={{
              padding: '0.35rem 0.7rem',
              fontSize: '0.775rem',
              backgroundColor: viewMode === 'side-by-side' ? 'var(--primary-50)' : '#fff',
              borderColor: viewMode === 'side-by-side' ? 'var(--primary-600)' : 'var(--border-strong)',
              color: viewMode === 'side-by-side' ? 'var(--primary-900)' : 'var(--text-main)'
            }}
          >
            <Columns size={14} />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'side-by-side' ? (
        <div className="grid-2">
          {/* Base Year Panel */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <strong>Baseline: {baseYear}</strong>
              <span className="mono" style={{ color: 'var(--text-muted)' }}>Sentinel-2 L2A</span>
            </div>
            <div style={{ minHeight: '380px', borderRadius: '8px', overflow: 'hidden' }}>
              {baseYearData?.has_raw_imagery && baseYearData.image_url ? (
                <img 
                  src={baseYearData.image_url} 
                  alt={`Raigad Sentinel-2 ${baseYear}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              ) : (
                <ImagePlaceholder year={baseYear} metadata={baseYearData} />
              )}
            </div>
          </div>

          {/* Target Year Panel */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <strong>Target: {targetYear}</strong>
              <span className="mono" style={{ color: 'var(--text-muted)' }}>Sentinel-2 L2A</span>
            </div>
            <div style={{ minHeight: '380px', borderRadius: '8px', overflow: 'hidden' }}>
              {targetYearData?.has_raw_imagery && targetYearData.image_url ? (
                <img 
                  src={targetYearData.image_url} 
                  alt={`Raigad Sentinel-2 ${targetYear}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              ) : (
                <ImagePlaceholder year={targetYear} metadata={targetYearData} />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Swipe Mode */
        <div
          ref={containerRef}
          className="swipe-wrapper"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{ cursor: isDragging ? 'ew-resize' : 'default' }}
        >
          {/* Base Year (Bottom Layer: 2018) */}
          <div className="swipe-image-container">
            {baseYearData?.has_raw_imagery && baseYearData.image_url ? (
              <img 
                src={baseYearData.image_url} 
                alt={`Raigad Sentinel-2 ${baseYear}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <ImagePlaceholder year={baseYear} metadata={baseYearData} />
            )}
          </div>

          {/* Target Year (Top Layer: 2024, Clipped to Slider Position) */}
          <div
            className="swipe-image-container"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
            }}
          >
            {targetYearData?.has_raw_imagery && targetYearData.image_url ? (
              <img 
                src={targetYearData.image_url} 
                alt={`Raigad Sentinel-2 ${targetYear}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <ImagePlaceholder year={targetYear} metadata={targetYearData} />
            )}
          </div>

          {/* Swipe Divider Bar */}
          <div
            className="swipe-slider"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="swipe-handle">
              ⇔
            </div>
          </div>

          {/* Persistent Labels */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 30,
            pointerEvents: 'none'
          }}>
            ◀ {baseYear} (Baseline)
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 30,
            pointerEvents: 'none'
          }}>
            {targetYear} (Target) ▶
          </div>
        </div>
      )}

      {/* Sensor Spectral Information Bar */}
      <SensorInfoBar />
    </div>
  );
}
