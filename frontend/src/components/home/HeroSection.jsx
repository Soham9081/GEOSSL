import React from 'react';
import { Columns, Trees, Building2, Flame, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onStartAnalysis }) {
  return (
    <section id="home" className="hero-wrapper">
      <div className="container">
        {/* Prototype Tag */}
        <div className="hero-tag">
          <ShieldCheck size={16} />
          <span>GeoSSL • Functional Prototype</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="hero-heading">
          Satellite-Based Environmental Monitoring
        </h1>
        <p className="hero-description">
          Monitor environmental changes using multi-temporal satellite imagery and a future self-supervised learning framework.
        </p>

        {/* Start Action */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={onStartAnalysis}
            className="btn btn-primary"
            style={{ padding: '0.875rem 2.25rem', fontSize: '1.05rem', boxShadow: 'var(--shadow-md)' }}
          >
            <span>Start Analysis</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Four Small Feature Cards */}
        <div className="feature-grid-4">
          {/* Card 1: Satellite Comparison */}
          <div
            className="card-clean"
            style={{ textAlign: 'left', cursor: 'pointer' }}
            onClick={onStartAnalysis}
            title="Go to Satellite Comparison"
          >
            <div style={{
              display: 'inline-flex',
              padding: '0.625rem',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#0284c7',
              marginBottom: '1rem'
            }}>
              <Columns size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-950)' }}>
              Satellite Comparison
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Inspect multi-temporal 2019 vs 2025 Sentinel-2 imagery with interactive swipe slider and side-by-side inspection.
            </p>
          </div>

          {/* Card 2: Forest Change */}
          <div className="card-clean" style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.625rem',
              borderRadius: '10px',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              marginBottom: '1rem'
            }}>
              <Trees size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-950)' }}>
              Forest Change
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Track forest canopy density shifts, vegetation health, and ecological preservation across rural and forested tracts.
            </p>
          </div>

          {/* Card 3: Urban Expansion */}
          <div className="card-clean" style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.625rem',
              borderRadius: '10px',
              background: 'var(--urban-gain-bg)',
              color: 'var(--urban-gain)',
              marginBottom: '1rem'
            }}>
              <Building2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-950)' }}>
              Urban Expansion
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Identify built-up development, transportation corridors, and peri-urban infrastructure growth over time.
            </p>
          </div>

          {/* Card 4: Environmental Heat Indicator */}
          <div className="card-clean" style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.625rem',
              borderRadius: '10px',
              background: 'var(--heat-amber-bg)',
              color: 'var(--heat-amber)',
              marginBottom: '1rem'
            }}>
              <Flame size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-950)' }}>
              Environmental Heat Indicator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Evaluate surface thermal vulnerability resulting from vegetative loss and expanding impervious ground cover.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
