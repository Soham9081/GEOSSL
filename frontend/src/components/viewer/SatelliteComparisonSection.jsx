import React, { useState, useRef, useEffect } from 'react';
import { Columns, SplitSquareVertical, Satellite, Sparkles, Loader2, MapPin, Calendar } from 'lucide-react';

export default function SatelliteComparisonSection({
  baseYear = 2019,
  targetYear = 2025,
  baseImageData,
  targetImageData,
  onCompareChanges,
  isAnalyzing,
  studyRegion,
  isLoading = false
}) {
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' or 'side-by-side'
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const containerRef = useRef(null);

  const regionName = studyRegion?.name || 'Selected Study Area';
  const centroidLat = studyRegion?.centroid?.lat != null ? studyRegion.centroid.lat : 18.5158;
  const centroidLon = studyRegion?.centroid?.lon != null ? studyRegion.centroid.lon : 73.1822;
  const bbox = studyRegion?.bbox || null; // [minLon, minLat, maxLon, maxLat]

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
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

  const handleImgError = (year) => {
    setImgErrors(prev => ({ ...prev, [year]: true }));
  };

  // Render Image, Loading Spinner, or Clear Empty/Unavailable State
  const renderImageOrPlaceholder = (year, data) => {
    if (isLoading) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: '420px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          color: '#f8fafc',
          position: 'relative'
        }}>
          <Loader2 size={36} className="animate-spin" style={{ color: '#38bdf8', marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', fontWeight: 600 }}>
            Querying Google Earth Engine...
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '380px', margin: '0 auto' }}>
            Retrieving {year} Sentinel-2 Level-2A surface reflectance imagery for the selected study area.
          </p>
        </div>
      );
    }

    if (data?.has_raw_imagery && data.image_url && !imgErrors[year]) {
      return (
        <img
          src={data.image_url}
          alt={`Sentinel-2 ${regionName} ${year}`}
          onError={() => handleImgError(year)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      );
    }

    return (
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        color: '#f8fafc',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} />

        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          padding: '0.75rem',
          borderRadius: '50%',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 1
        }}>
          <Satellite size={28} />
        </div>

        <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', fontWeight: 600, position: 'relative', zIndex: 1 }}>
          Satellite imagery unavailable
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '380px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {data?.data_source?.includes('Unavailable')
            ? `Google Earth Engine could not find clear Sentinel-2 scenes for this region in ${year}.`
            : `Sentinel-2 imagery could not be retrieved for this selected region in ${year}.`}
        </p>
      </div>
    );
  };

  return (
    <section id="comparison" className="section">
      <div className="container">
        {/* Section Heading */}
        <div className="section-header">
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
            Study Region: {regionName}
          </span>
          <h2 className="section-title">Satellite Comparison</h2>
          <p className="section-subtitle">
            Compare multi-temporal satellite imagery to observe environmental changes over time.
          </p>
        </div>

        {/* Study Location / Study Area Card */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto 1.5rem',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            {/* Left: Study Location and Coordinates */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-700)',
                border: '1px solid var(--primary-100)',
                padding: '0.6rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                <MapPin size={22} />
              </div>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--primary-800)',
                  marginBottom: '0.2rem'
                }}>
                  Study Location
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--primary-950)',
                  lineHeight: 1.3
                }}>
                  {regionName}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Centroid:</span> {centroidLat}° N, {centroidLon}° E
                </div>
                {bbox && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>Bounds:</span>{' '}
                    [{bbox[1]}°, {bbox[0]}°] → [{bbox[3]}°, {bbox[2]}°]
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sensor and Comparison Epoch details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              background: 'var(--bg-page)',
              padding: '0.65rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--primary-700)" />
                <span>Comparison Epoch: <strong style={{ color: 'var(--primary-950)' }}>{baseYear} vs {targetYear}</strong></span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', height: '18px' }} />
              <div>
                Sensor: <strong style={{ color: 'var(--primary-950)' }}>Sentinel-2 MSI</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Viewer Container */}
        <div className="viewer-card" style={{ maxWidth: '1000px', margin: '0 auto 2rem' }}>
          {/* Top Bar / Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: '#0b1329',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <span style={{ color: '#38bdf8' }}>{baseYear} Satellite Image</span>
              <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>VS</span>
              <span style={{ color: '#34d399' }}>{targetYear} Satellite Image</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setViewMode('swipe')}
                className="btn btn-sm"
                style={{
                  background: viewMode === 'swipe' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <SplitSquareVertical size={14} />
                <span>Before/After Slider</span>
              </button>

              <button
                onClick={() => setViewMode('side-by-side')}
                className="btn btn-sm"
                style={{
                  background: viewMode === 'side-by-side' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Columns size={14} />
                <span>Side-by-Side</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen */}
          {viewMode === 'side-by-side' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
              <div style={{ position: 'relative', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                {renderImageOrPlaceholder(baseYear, baseImageData)}
                <div className="image-label-pill" style={{ left: '16px' }}>
                  {baseYear} Satellite Image
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                {renderImageOrPlaceholder(targetYear, targetImageData)}
                <div className="image-label-pill" style={{ right: '16px' }}>
                  {targetYear} Satellite Image
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Slider */
            <div
              ref={containerRef}
              className="swipe-container"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              style={{ cursor: isDragging ? 'ew-resize' : 'default' }}
            >
              {/* Bottom Layer: Base Year 2019 */}
              <div className="swipe-pane">
                {renderImageOrPlaceholder(baseYear, baseImageData)}
              </div>

              {/* Top Layer: Target Year 2025 (Clipped to Slider Position) */}
              <div
                className="swipe-pane"
                style={{
                  clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`
                }}
              >
                {renderImageOrPlaceholder(targetYear, targetImageData)}
              </div>

              {/* Slider Divider Bar */}
              <div
                className="swipe-divider"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                <div className="swipe-knob">
                  ⇔
                </div>
              </div>

              {/* Floating Year Tags */}
              <div className="image-label-pill" style={{ left: '16px' }}>
                ◀ {baseYear} Satellite Image
              </div>
              <div className="image-label-pill" style={{ right: '16px' }}>
                {targetYear} Satellite Image ▶
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: Analyze Environmental Changes Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onCompareChanges}
            disabled={isAnalyzing}
            className="btn btn-primary"
            style={{
              padding: '0.95rem 2.5rem',
              fontSize: '1.05rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Analyzing Environmental Changes...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Analyze Environmental Changes</span>
              </>
            )}
          </button>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Calculates vegetation canopy, built-up expansion, and heat indicator changes, then displays the results
          </div>
        </div>
      </div>
    </section>
  );
}
