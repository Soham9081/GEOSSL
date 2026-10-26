import React from 'react';
import { Building2, TrendingUp } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function UrbanChangeCard({ data }) {
  if (!data) return null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="card-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: 'var(--urban-gain-bg)',
              color: 'var(--urban-gain)',
              padding: '0.35rem',
              borderRadius: '6px'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>Urban & Land-Use Expansion</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Index: {data.spectral_index}
              </span>
            </div>
          </div>
          <ProvenanceBadge type="prototype" label="Pre-ML Prototype" />
        </div>

        {/* Formula Box */}
        <div style={{
          background: 'var(--bg-main)',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.725rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Formula: <code className="mono">{data.spectral_formula}</code></span>
          <span className="mono">B11 (SWIR) & B8 (NIR)</span>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {data.key_metrics?.map((m, idx) => (
            <div key={idx} style={{
              background: m.direction === 'increase' ? 'var(--urban-gain-bg)' : '#f8fafc',
              border: `1px solid ${m.direction === 'increase' ? '#fde68a' : 'var(--border-subtle)'}`,
              padding: '0.625rem',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                {m.label}
              </span>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: m.direction === 'increase' ? 'var(--urban-gain)' : 'var(--text-main)',
                marginTop: '0.2rem'
              }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '0.875rem' }}>
          <strong>Assessment:</strong> {data.interpretation}
        </div>
      </div>

      {/* Growth Corridors */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
          High-Growth Peri-Urban Corridors:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
          {data.high_growth_corridors?.map((corridor) => (
            <span key={corridor} style={{
              fontSize: '0.725rem',
              background: 'var(--urban-gain-bg)',
              color: 'var(--urban-gain)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid #fef3c7',
              fontWeight: 500
            }}>
              {corridor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
