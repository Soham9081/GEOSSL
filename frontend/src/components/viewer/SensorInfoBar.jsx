import React from 'react';
import { Info, AlertTriangle, Layers } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function SensorInfoBar() {
  const bands = [
    { id: 'B2', name: 'Blue', res: '10m', lambda: '490nm' },
    { id: 'B3', name: 'Green', res: '10m', lambda: '560nm' },
    { id: 'B4', name: 'Red', res: '10m', lambda: '665nm' },
    { id: 'B8', name: 'NIR', res: '10m', lambda: '842nm' },
    { id: 'B11', name: 'SWIR-1', res: '20m', lambda: '1610nm' },
    { id: 'B12', name: 'SWIR-2', res: '20m', lambda: '2190nm' }
  ];

  return (
    <div style={{
      marginTop: '1rem',
      padding: '0.875rem 1rem',
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} color="var(--primary-700)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Sensor Spectral Architecture (Sentinel-2 MSI Level-2A)
          </span>
        </div>
        <ProvenanceBadge type="real" label="Copernicus Catalog" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {bands.map((b) => (
          <div key={b.id} style={{
            padding: '0.3rem 0.6rem',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontSize: '0.725rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <strong style={{ color: 'var(--primary-800)' }}>{b.id}</strong>
            <span style={{ color: 'var(--text-muted)' }}>({b.name}, {b.lambda}, {b.res})</span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'var(--heat-amber-bg)',
        border: '1px solid #fed7aa',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#9a3412'
      }}>
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>Sensor Note:</strong> Sentinel-2 has <strong>no thermal infrared (TIR) bands</strong> and does not record surface kinetic temperature. 
          Thermal analysis in this prototype is an environmental vulnerability proxy; direct Land Surface Temperature (LST) will integrate Landsat 8/9 TIRS (Band 10) in Phase 2.
        </span>
      </div>
    </div>
  );
}
