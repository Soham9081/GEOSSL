import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

export default function StatusBanner() {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid var(--border-subtle)',
      borderLeft: '4px solid var(--primary-600)',
      borderRadius: '10px',
      padding: '0.875rem 1.25rem',
      marginBottom: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-900)' }}>
        <Info size={18} color="var(--primary-700)" />
        <span>System Architecture & Prototype Transparency Notice</span>
      </div>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
        The full Self-Supervised Masked Autoencoder (MAE) + Vision Transformer (ViT) model is currently <strong>untrained</strong> (pre-training stage). 
        The environmental change analytics displayed below are computed by the backend's <strong>PrototypeAnalysisEngine</strong> (multi-spectral index baseline) 
        to validate full-stack API integration. No synthetic neural network accuracy, loss, or model predictions are claimed.
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--primary-100)', color: 'var(--primary-800)', borderRadius: '4px', fontWeight: 500 }}>
          ✔ Real: FastAPI Backend & React Client
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--primary-100)', color: 'var(--primary-800)', borderRadius: '4px', fontWeight: 500 }}>
          ✔ Real: Raigad Geospatial Coordinates & Sentinel-2 Specs
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontWeight: 500 }}>
          ⚠ Prototype: Spectral Index Change Computation (Pre-ML)
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#ede9fe', color: '#5b21b6', borderRadius: '4px', fontWeight: 500 }}>
          ⚙ Future: Pluggable MAE + ViT Inference Pipeline
        </span>
      </div>
    </div>
  );
}
