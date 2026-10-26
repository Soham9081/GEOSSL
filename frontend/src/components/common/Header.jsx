import React from 'react';
import { Satellite, ShieldCheck, FileText, Activity } from 'lucide-react';

export default function Header({ systemStatus, onOpenReport }) {
  const isOnline = Boolean(systemStatus);

  return (
    <header className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--primary-700)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <span style={{ 
              background: 'var(--primary-100)', 
              color: 'var(--primary-800)', 
              padding: '0.35rem 0.5rem', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <Satellite size={20} />
            </span>
            <h1 style={{ fontSize: '1.35rem', color: 'var(--primary-900)' }}>GeoSSL</h1>
            <span className="badge badge-real" style={{ fontSize: '0.75rem' }}>
              Functional Prototype
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '820px' }}>
            Self-Supervised Learning on Satellite Imagery for Label-Efficient Regional Climate Change Monitoring
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            <span><strong>Target Area:</strong> Raigad District, Maharashtra</span>
            <span><strong>Sensor:</strong> Sentinel-2 Level-2A (MSI)</span>
            <span><strong>Core ML:</strong> Masked Autoencoder (MAE) + ViT</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            background: isOnline ? 'var(--primary-50)' : '#fef2f2',
            border: `1px solid ${isOnline ? 'var(--primary-100)' : '#fecaca'}`,
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: isOnline ? 'var(--primary-800)' : '#991b1b'
          }}>
            <Activity size={14} />
            <span>{isOnline ? 'Backend API Connected' : 'Connecting to FastAPI...'}</span>
          </div>

          <button 
            onClick={onOpenReport}
            className="btn-outline"
            title="Generate structured academic review report"
          >
            <FileText size={16} color="var(--primary-700)" />
            <span>Academic Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
