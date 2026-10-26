import React from 'react';
import { MapPin, Compass, Layers } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function RegionSelector({ region, talukas = [] }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="var(--primary-700)" />
          <h3 style={{ fontSize: '1rem' }}>Study Region</h3>
        </div>
        <ProvenanceBadge type="real" label="Study Area ROI" />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            {region?.name || 'Raigad District'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {region?.state || 'Maharashtra'}, India
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Konkan coastal zone characterized by Northern peri-urban expansion (Panvel/Uran) and Eastern Western Ghats forest canopy.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '0.5rem', 
        background: 'var(--bg-main)', 
        padding: '0.625rem', 
        borderRadius: '8px', 
        fontSize: '0.775rem',
        marginBottom: '0.75rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-subtle)' }}>Coordinates:</span>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            18.5158° N, 73.1822° E
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)' }}>Total Area:</span>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            ~7,152 sq km
          </div>
        </div>
      </div>

      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
          Administrative Talukas ({talukas.length || 15}):
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxHeight: '68px', overflowY: 'auto' }}>
          {talukas.map((taluka) => (
            <span key={taluka} style={{
              fontSize: '0.7rem',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              color: 'var(--text-muted)'
            }}>
              {taluka}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
