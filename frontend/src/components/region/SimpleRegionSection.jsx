import React from 'react';
import { MapPin, ArrowRight, Calendar, Info } from 'lucide-react';

export default function SimpleRegionSection({ onContinue }) {
  return (
    <section id="region" className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
            Designated Area of Study
          </span>
          <h2 className="section-title">Study Region</h2>
          <p className="section-subtitle">
            Raigad District, Maharashtra
          </p>
        </div>

        <div className="card-clean" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '2.25rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '0.75rem',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            marginBottom: '1rem'
          }}>
            <MapPin size={32} />
          </div>

          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-950)', marginBottom: '0.35rem' }}>
            Raigad, Maharashtra
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            A strategically vital coastal district in Western India experiencing significant peri-urban growth in the north and rich Western Ghats ecological zones in the south.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: 'var(--bg-page)',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-900)', fontWeight: 600, fontSize: '0.95rem' }}>
              <Calendar size={18} color="var(--primary-700)" />
              <span>Comparison Epoch: 2019 → 2025</span>
            </div>
          </div>

          <a
            href="#comparison"
            onClick={onContinue}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            <span>Continue to Satellite Comparison</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
