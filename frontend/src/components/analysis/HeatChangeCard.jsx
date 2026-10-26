import React from 'react';
import { Flame, AlertTriangle, Cpu } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function HeatChangeCard({ data }) {
  if (!data) return null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="card-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: 'var(--heat-amber-bg)',
              color: 'var(--heat-amber)',
              padding: '0.35rem',
              borderRadius: '6px'
            }}>
              <Flame size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>Environmental Heat / Thermal</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Type: {data.indicator_type}
              </span>
            </div>
          </div>
          <ProvenanceBadge type="warning" label="Non-TIR Proxy" />
        </div>

        {/* Critical Physical Limitation Notice */}
        <div style={{
          background: 'var(--heat-amber-bg)',
          border: '1px solid #fed7aa',
          padding: '0.625rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#9a3412',
          marginBottom: '1rem',
          lineHeight: '1.4'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontWeight: 600 }}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Sensor Limitation Notice:</span>
          </div>
          <p style={{ marginTop: '0.25rem', fontSize: '0.725rem' }}>
            {data.sensor_limitation_statement}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {data.key_metrics?.map((m, idx) => (
            <div key={idx} style={{
              background: m.direction === 'increase' ? 'var(--heat-amber-bg)' : '#f8fafc',
              border: `1px solid ${m.direction === 'increase' ? '#fed7aa' : 'var(--border-subtle)'}`,
              padding: '0.625rem',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                {m.label}
              </span>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: m.direction === 'increase' ? 'var(--heat-amber)' : 'var(--text-main)',
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

      {/* Future Roadmap Box */}
      <div style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        paddingTop: '0.75rem',
        background: '#f8fafc',
        padding: '0.625rem',
        borderRadius: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4338ca', fontSize: '0.725rem', fontWeight: 600 }}>
          <Cpu size={14} />
          <span>Future Thermal Architecture (Phase 2):</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {data.future_thermal_pipeline}
        </p>
      </div>
    </div>
  );
}
