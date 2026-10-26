import React from 'react';
import { Trees, Building2, Flame, Clock, FileText, ArrowLeft } from 'lucide-react';

export default function ResultsSection({ analysisData, onOpenReport, onBackToComparison }) {
  const hasImagery = Boolean(analysisData?.has_imagery && analysisData?.forest_change?.baseline_year_index != null);
  const baseYear = analysisData?.base_year || 2019;
  const targetYear = analysisData?.target_year || 2025;
  const forest = analysisData?.forest_change;
  const urban = analysisData?.urban_change;
  const heat = analysisData?.heat_change;

  return (
    <section id="results" className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="badge badge-prototype" style={{ marginBottom: '0.5rem' }}>
            Pre-ML Prototype
          </span>
          <h2 className="section-title">Environmental Changes</h2>
          <p className="section-subtitle">
            Environmental indicator evaluation for Raigad district ({baseYear} → {targetYear})
          </p>
        </div>

        {/* 3 Simple Result Cards */}
        <div className="feature-grid" style={{ marginBottom: '2.5rem' }}>
          {/* 1. Forest Change Card */}
          <div className="card-clean" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  background: 'var(--forest-loss-bg)',
                  color: 'var(--forest-loss)',
                  padding: '0.5rem',
                  borderRadius: '10px'
                }}>
                  <Trees size={24} />
                </div>
                <span className="badge badge-prototype">Pre-ML Prototype</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-950)', marginBottom: '0.25rem' }}>
                Forest Change
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                Canopy Index Shift (NDVI)
              </span>

              {hasImagery && forest?.index_delta_percent != null ? (
                <>
                  <div style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: forest.index_delta_percent >= 0 ? '#059669' : 'var(--forest-loss)',
                    marginBottom: '0.25rem'
                  }}>
                    {forest.index_delta_percent > 0 ? `+${forest.index_delta_percent}%` : `${forest.index_delta_percent}%`}
                  </div>
                  {forest.baseline_year_index != null && forest.target_year_index != null && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Mean NDVI: <strong>{forest.baseline_year_index}</strong> ({baseYear}) → <strong>{forest.target_year_index}</strong> ({targetYear})
                    </div>
                  )}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {forest.interpretation}
                  </p>
                </>
              ) : (
                <div style={{
                  background: 'var(--bg-page)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: '8px',
                  padding: '1.25rem 1rem',
                  margin: '0.75rem 0 1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    <Clock size={16} color="var(--primary-700)" />
                    <span>Awaiting Satellite Imagery</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quantitative analysis will be available after satellite imagery is added.
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.45', marginTop: '0.5rem' }}>
                Tracks canopy density shifts and vegetative retention across Western Ghats forests and peri-urban fringes.
              </p>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Sensor: Sentinel-2 MSI • Formula: (NIR - Red) / (NIR + Red)
            </div>
          </div>

          {/* 2. Urban Expansion Card */}
          <div className="card-clean" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  background: 'var(--urban-gain-bg)',
                  color: 'var(--urban-gain)',
                  padding: '0.5rem',
                  borderRadius: '10px'
                }}>
                  <Building2 size={24} />
                </div>
                <span className="badge badge-prototype">Pre-ML Prototype</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-950)', marginBottom: '0.25rem' }}>
                Urban Expansion
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                Built-Up Expansion Index (NDBI)
              </span>

              {hasImagery && urban?.index_delta_percent != null ? (
                <>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--urban-gain)', marginBottom: '0.25rem' }}>
                    {urban.index_delta_percent > 0 ? `+${urban.index_delta_percent}%` : `${urban.index_delta_percent}%`}
                  </div>
                  {urban.baseline_year_index != null && urban.target_year_index != null && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Mean NDBI: <strong>{urban.baseline_year_index}</strong> ({baseYear}) → <strong>{urban.target_year_index}</strong> ({targetYear})
                    </div>
                  )}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {urban.interpretation}
                  </p>
                </>
              ) : (
                <div style={{
                  background: 'var(--bg-page)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: '8px',
                  padding: '1.25rem 1rem',
                  margin: '0.75rem 0 1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    <Clock size={16} color="var(--primary-700)" />
                    <span>Awaiting Satellite Imagery</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quantitative analysis will be available after satellite imagery is added.
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.45', marginTop: '0.5rem' }}>
                Identifies built-up growth, paved ground, and transportation corridors across northern and coastal talukas.
              </p>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Sensor: Sentinel-2 MSI • Formula: (SWIR - NIR) / (SWIR + NIR)
            </div>
          </div>

          {/* 3. Environmental Heat Indicator Card */}
          <div className="card-clean" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  background: 'var(--heat-amber-bg)',
                  color: 'var(--heat-amber)',
                  padding: '0.5rem',
                  borderRadius: '10px'
                }}>
                  <Flame size={24} />
                </div>
                <span className="badge badge-amber">{heat?.data_source ? 'Landsat 8/9 TIRS' : 'Thermal Proxy'}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-950)', marginBottom: '0.25rem' }}>
                Environmental Heat Indicator
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                {heat?.temperature_delta_c != null ? 'Land Surface Temperature (LST)' : 'Thermal Vulnerability Proxy'}
              </span>

              {hasImagery && (heat?.temperature_delta_c != null || heat?.vulnerability_delta_percent != null) ? (
                <>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--heat-amber)', marginBottom: '0.25rem' }}>
                    {heat?.temperature_delta_c != null
                      ? `${heat.temperature_delta_c > 0 ? '+' : ''}${heat.temperature_delta_c}°C`
                      : `+${heat.vulnerability_delta_percent}%`}
                  </div>
                  {heat?.baseline_mean_temperature_c != null && heat?.target_mean_temperature_c != null && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Mean LST: <strong>{heat.baseline_mean_temperature_c}°C</strong> ({baseYear}) → <strong>{heat.target_mean_temperature_c}°C</strong> ({targetYear})
                    </div>
                  )}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                    {heat.interpretation}
                  </p>
                </>
              ) : (
                <div style={{
                  background: 'var(--bg-page)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: '8px',
                  padding: '1.25rem 1rem',
                  margin: '0.75rem 0 1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    <Clock size={16} color="var(--primary-700)" />
                    <span>Awaiting Satellite Imagery</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quantitative analysis will be available after satellite imagery is added.
                  </div>
                </div>
              )}

              {/* Explicit Sensor Limitation Note */}
              <div style={{
                background: 'var(--heat-amber-bg)',
                border: '1px solid #fed7aa',
                borderRadius: '8px',
                padding: '0.6rem 0.75rem',
                fontSize: '0.75rem',
                color: '#9a3412',
                lineHeight: '1.4'
              }}>
                <strong>Sensor Note:</strong> Sentinel-2 has no thermal infrared sensor. Surface temperature is directly computed from Landsat 8/9 TIRS thermal data (Band 10).
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              Sensor: Landsat 8/9 TIRS • Method: Thermal Radiometry (ST_B10)
            </div>
          </div>
        </div>

        {/* Bottom Actions: Navigation and Academic Report */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button
            onClick={onBackToComparison}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Satellite Comparison</span>
          </button>

          <button
            disabled
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem', cursor: 'not-allowed', opacity: 0.65 }}
          >
            <FileText size={16} />
            <span>Generate Academic Report</span>
          </button>
        </div>

        {/* Informative Academic Summary Notice */}
        <div style={{
          background: 'var(--bg-page)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-950)', marginBottom: '0.2rem' }}>
              Want a comprehensive academic report of this evaluation?
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Generates a printable report documenting study parameters, spectral band definitions, and methodology distinctions.
            </p>
          </div>

          <button
            disabled
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem', cursor: 'not-allowed', opacity: 0.65 }}
          >
            <FileText size={14} />
            <span>Preview Report</span>
          </button>
        </div>
      </div>
    </section>
  );
}
