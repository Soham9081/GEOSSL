import React from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function YearSelector({ baseYear = 2018, targetYear = 2024, onYearChange }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--primary-700)" />
          <h3 style={{ fontSize: '1rem' }}>Temporal Pair Selection</h3>
        </div>
        <ProvenanceBadge type="real" label="6-Year Delta" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', margin: '1rem 0' }}>
        <div style={{
          flex: 1,
          padding: '0.75rem',
          border: '2px solid var(--primary-700)',
          background: 'var(--primary-50)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary-800)', textTransform: 'uppercase', fontWeight: 600 }}>
            Baseline Epoch
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            {baseYear}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Post-Monsoon (Nov–Dec)
          </span>
        </div>

        <ArrowRight size={24} color="var(--primary-700)" />

        <div style={{
          flex: 1,
          padding: '0.75rem',
          border: '2px solid var(--primary-700)',
          background: 'var(--primary-50)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary-800)', textTransform: 'uppercase', fontWeight: 600 }}>
            Target Epoch
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-900)' }}>
            {targetYear}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Post-Monsoon (Nov–Dec)
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.625rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem', color: 'var(--primary-900)', fontWeight: 600 }}>
          <Clock size={14} />
          <span>Rationale for 2018 vs 2024:</span>
        </div>
        Provides an optimal 6-year multi-temporal window capturing peri-urban infrastructure expansion (Panvel/MTHL link) and forest dynamics without seasonal Phenological bias.
      </div>
    </div>
  );
}
