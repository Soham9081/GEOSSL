import React from 'react';
import { X, Printer, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, reportData }) {
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const findings = reportData.analysis_findings;
  const hasImagery = Boolean(findings?.has_imagery && findings?.forest_change?.baseline_year_index != null);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary-800)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-950)' }}>
              Academic Review Report
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              <X size={15} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Academic Document */}
        <div style={{ color: '#0f172a' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid var(--primary-900)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-950)', marginBottom: '0.25rem' }}>
                  {reportData.report_title}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {reportData.project_title}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">
                  {reportData.academic_phase}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                  Date: {reportData.generated_at}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Study Parameters */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>
              1. Study Region & Satellite Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.825rem' }}>
              <div><strong>Region Name:</strong> {reportData.region_metadata?.name}, {reportData.region_metadata?.state}</div>
              <div><strong>Centroid:</strong> 18.5158° N, 73.1822° E</div>
              <div><strong>Comparison Epoch:</strong> {reportData.temporal_comparison?.baseline_year} vs {reportData.temporal_comparison?.target_year}</div>
              <div><strong>Satellite Sensor:</strong> Sentinel-2 Level-2A (MSI)</div>
              <div><strong>Ground Resolution:</strong> 10m (VNIR), 20m (SWIR)</div>
              <div><strong>Catalog:</strong> Copernicus S2_SR_HARMONIZED</div>
            </div>
          </div>

          {/* Section 2: Sensor Physical Capability Notice */}
          <div style={{
            marginBottom: '1.25rem',
            background: 'var(--heat-amber-bg)',
            border: '1px solid #fed7aa',
            borderRadius: '6px',
            padding: '0.75rem',
            fontSize: '0.775rem',
            color: '#9a3412',
            lineHeight: '1.45'
          }}>
            <strong>Sensor Limitation Notice:</strong> Sentinel-2 contains no Thermal Infrared (TIR) channels and cannot directly measure kinetic Land Surface Temperature (LST). The heat indicator represents an environmental thermal vulnerability proxy. Direct thermal analysis will integrate Landsat 8/9 TIRS (Band 10) in future phases.
          </div>

          {/* Section 3: Prototype Environmental Findings */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                2. Environmental Change Findings (Pre-ML Prototype Analysis)
              </h4>
              <span className="badge badge-prototype">Prototype Baseline</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border-strong)' }}>
                  <th style={{ padding: '0.5rem' }}>Domain</th>
                  <th style={{ padding: '0.5rem' }}>Spectral Indicator</th>
                  <th style={{ padding: '0.5rem' }}>Baseline ({reportData.temporal_comparison?.baseline_year})</th>
                  <th style={{ padding: '0.5rem' }}>Target ({reportData.temporal_comparison?.target_year})</th>
                  <th style={{ padding: '0.5rem' }}>Observed Shift</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>Forest Change</td>
                  <td style={{ padding: '0.5rem' }}>NDVI Vegetation Index</td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.forest_change?.baseline_year_index != null ? findings.forest_change.baseline_year_index.toFixed(3) : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.forest_change?.target_year_index != null ? findings.forest_change.target_year_index.toFixed(3) : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>
                    {hasImagery && findings?.forest_change?.index_delta_percent != null ? `${findings.forest_change.index_delta_percent}%` : 'Awaiting Imagery'}
                  </td>
                  <td style={{ padding: '0.5rem' }}><span className="badge badge-prototype">Pre-ML</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>Urban Expansion</td>
                  <td style={{ padding: '0.5rem' }}>NDBI Built-up Index</td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.urban_change?.baseline_year_index != null ? findings.urban_change.baseline_year_index.toFixed(3) : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.urban_change?.target_year_index != null ? findings.urban_change.target_year_index.toFixed(3) : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>
                    {hasImagery && findings?.urban_change?.index_delta_percent != null ? `+${findings.urban_change.index_delta_percent}%` : 'Awaiting Imagery'}
                  </td>
                  <td style={{ padding: '0.5rem' }}><span className="badge badge-prototype">Pre-ML</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>Heat Indicator</td>
                  <td style={{ padding: '0.5rem' }}>Thermal Vulnerability Proxy</td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.heat_change?.baseline_vulnerability_score != null ? `${findings.heat_change.baseline_vulnerability_score.toFixed(1)}/100` : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem' }} className="mono">
                    {hasImagery && findings?.heat_change?.target_vulnerability_score != null ? `${findings.heat_change.target_vulnerability_score.toFixed(1)}/100` : 'Pending'}
                  </td>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>
                    {hasImagery && findings?.heat_change?.vulnerability_delta_percent != null ? `+${findings.heat_change.vulnerability_delta_percent}%` : 'Awaiting Imagery'}
                  </td>
                  <td style={{ padding: '0.5rem' }}><span className="badge badge-amber">Non-TIR Proxy</span></td>
                </tr>
              </tbody>
            </table>

            {!hasImagery && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                * Note: Quantitative analysis will be available after satellite imagery is added.
              </div>
            )}
          </div>

          {/* Section 4: Academic Methodology Distinction */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>
              3. Methodology Classification (Integrity Statement)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.775rem' }}>
              <div style={{ background: 'var(--primary-50)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--primary-100)' }}>
                <strong style={{ color: 'var(--primary-900)', display: 'block', marginBottom: '0.2rem' }}>
                  ✔ Actual Pipeline Work
                </strong>
                FastAPI backend, React frontend, REST API protocols, Sentinel-2 spectral definitions, Raigad spatial bounding polygon, pluggable adapter architecture.
              </div>
              <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
                <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.2rem' }}>
                  ⚠ Prototype Analysis
                </strong>
                Deterministic multi-spectral index calculation (NDVI/NDBI/Proxy) verifying user flow prior to machine learning model training.
              </div>
              <div style={{ background: '#ede9fe', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd6fe' }}>
                <strong style={{ color: '#5b21b6', display: 'block', marginBottom: '0.2rem' }}>
                  ⚙ Future MAE + ViT
                </strong>
                Vision Transformer pretraining on unlabeled Sentinel-2 imagery with 75% masking; supervised fine-tuning using minimal ground truth. Model is currently untrained.
              </div>
            </div>
          </div>

          {/* Footer Footnote */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            <span>Final-Year Engineering Project</span>
            <span>GeoSSL Prototype • Pluggable Architecture Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
