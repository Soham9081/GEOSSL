import React from 'react';
import { Satellite, AlertCircle, Compass } from 'lucide-react';

export default function ImagePlaceholder({ year, metadata }) {

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '380px',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #334155',
      borderRadius: '8px'
    }}>
      {/* Reticle / Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none'
      }} />

      {/* Top Bar with Geospatial Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
        <div>
          <span style={{
            background: 'rgba(6, 78, 59, 0.7)',
            color: '#6ee7b7',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Sentinel-2 MSI Level-2A • {year}
          </span>
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            ROI: Raigad District (18.52° N, 73.18° E)
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
          <div>MGRS: T43QCA / T43QDA</div>
          <div>Bands: 10m VNIR (B2,3,4,8)</div>
        </div>
      </div>

      {/* Center Notice: Clear Imagery Ingestion Card */}
      <div style={{
        zIndex: 2,
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '1.5rem',
        maxWidth: '460px',
        margin: '1.5rem auto',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          display: 'inline-flex',
          padding: '0.6rem',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          marginBottom: '0.75rem'
        }}>
          <Satellite size={26} />
        </div>
        
        <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.35rem' }}>
          Satellite imagery will appear here
        </h4>
        
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.45' }}>
          Satellite imagery is being prepared for this comparison.
        </p>
      </div>

      {/* Bottom Status Ticker */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.7rem',
        color: '#64748b',
        borderTop: '1px solid #334155',
        paddingTop: '0.5rem',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertCircle size={12} color="#f59e0b" />
          <span>Academic Review Ingestion Pipeline Active</span>
        </div>
        <div style={{ fontFamily: 'monospace' }}>
          Status: Awaiting GEE Export
        </div>
      </div>
    </div>
  );
}
