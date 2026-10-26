import React from 'react';
import { X, Layers, Cpu, Compass, BookOpen, AlertTriangle } from 'lucide-react';

export default function TechnicalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const bands = [
    { band: "B2", name: "Blue", lambda: "490 nm", res: "10 m", purpose: "Atmospheric & coastal aerosol penetration" },
    { band: "B3", name: "Green", lambda: "560 nm", res: "10 m", purpose: "Peak vegetation green reflectance" },
    { band: "B4", name: "Red", lambda: "665 nm", res: "10 m", purpose: "Chlorophyll light absorption reference" },
    { band: "B8", name: "NIR", lambda: "842 nm", res: "10 m", purpose: "Near-infrared vegetation cellular structure" },
    { band: "B11", name: "SWIR-1", lambda: "1610 nm", res: "20 m", purpose: "Moisture & impervious built-up surface response" },
    { band: "B12", name: "SWIR-2", lambda: "2190 nm", res: "20 m", purpose: "Geological substrate & soil characterization" }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--primary-800)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-950)' }}>
              GeoSSL: Technical Details & Specifications
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Section 1: Study Region Geospatial Specs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass size={16} />
            <span>1. Study Region Geospatial Parameters (Raigad, Maharashtra)</span>
          </h4>
          <div style={{ background: 'var(--bg-page)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.825rem', border: '1px solid var(--border-subtle)', lineHeight: '1.6' }}>
            <div><strong>Geographic Centroid:</strong> 18.5158° N, 73.1822° E</div>
            <div><strong>Bounding Coordinates:</strong> 17.85° N – 19.15° N, 72.85° E – 73.55° E</div>
            <div><strong>Sentinel-2 MGRS Granules:</strong> T43QCA, T43QDA</div>
            <div><strong>Total Surface Area:</strong> ~7,152 sq km (15 Administrative Talukas)</div>
            <div><strong>Key Talukas:</strong> Alibag, Panvel, Roha, Mahad, Mangaon, Pen, Karjat, Khalapur, Murud, Shrivardhan, Poladpur, Tala, Uran</div>
          </div>
        </div>

        {/* Section 2: Sensor Bands Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={16} />
            <span>2. Sentinel-2 MSI Multi-Spectral Bands Used</span>
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '0.4rem' }}>Band</th>
                <th style={{ padding: '0.4rem' }}>Name</th>
                <th style={{ padding: '0.4rem' }}>Central Wavelength</th>
                <th style={{ padding: '0.4rem' }}>Resolution</th>
                <th style={{ padding: '0.4rem' }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.band} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.4rem', fontWeight: 600 }} className="mono">{b.band}</td>
                  <td style={{ padding: '0.4rem' }}>{b.name}</td>
                  <td style={{ padding: '0.4rem' }} className="mono">{b.lambda}</td>
                  <td style={{ padding: '0.4rem' }}>{b.res}</td>
                  <td style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>{b.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '0.5rem', background: 'var(--heat-amber-bg)', border: '1px solid #fed7aa', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#9a3412' }}>
            <strong>Thermal Band Notice:</strong> Sentinel-2 has NO Thermal Infrared (TIR) channels. Land Surface Temperature (LST) derivation will integrate Landsat 8/9 TIRS (Band 10) in future phases.
          </div>
        </div>

        {/* Section 3: Spectral Formulas */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} />
            <span>3. Prototype Baseline Formulas (Pre-ML)</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--bg-page)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <strong>Normalized Difference Vegetation Index (NDVI):</strong>
              <div className="mono" style={{ margin: '0.35rem 0', color: 'var(--primary-900)' }}>NDVI = (B8 - B4) / (B8 + B4)</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Measures photosynthetic chlorophyll activity</span>
            </div>
            <div style={{ background: 'var(--bg-page)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <strong>Normalized Difference Built-up Index (NDBI):</strong>
              <div className="mono" style={{ margin: '0.35rem 0', color: 'var(--primary-900)' }}>NDBI = (B11 - B8) / (B11 + B8)</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Measures impervious concrete/asphalt growth</span>
            </div>
          </div>
        </div>

        {/* Section 4: Backend Pluggable Architecture */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} />
            <span>4. Pluggable Backend Architecture</span>
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            The backend implements the <code>BaseChangeAnalyzer</code> abstract adapter pattern. The current prototype executes <code>PrototypeAnalysisEngine</code>. Once model pre-training is finished, <code>GeoSSLMAEAnalysisEngine</code> will take over inference with zero frontend code changes.
          </p>
        </div>
      </div>
    </div>
  );
}
