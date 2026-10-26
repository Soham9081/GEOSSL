import React from 'react';
import { Satellite, Sliders, Cpu, Brain, CheckSquare, BarChart3, ArrowRight, AlertTriangle } from 'lucide-react';

export default function FutureAISection() {
  const workflowSteps = [
    {
      step: 1,
      title: "Satellite Images",
      subtitle: "Multi-temporal Sentinel-2 archives",
      icon: Satellite
    },
    {
      step: 2,
      title: "Preprocessing",
      subtitle: "Patch slicing (16×16 pixels)",
      icon: Sliders
    },
    {
      step: 3,
      title: "Self-Supervised Learning",
      subtitle: "Unlabeled pretraining pretext task",
      icon: Brain
    },
    {
      step: 4,
      title: "MAE + Vision Transformer",
      subtitle: "~75% patch masking & representation learning",
      icon: Cpu
    },
    {
      step: 5,
      title: "Fine-Tuning",
      subtitle: "Limited-label supervised adaptation",
      icon: CheckSquare
    },
    {
      step: 6,
      title: "Change Detection",
      subtitle: "Automated inference for Raigad",
      icon: BarChart3
    }
  ];

  return (
    <section id="future-ai" className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="badge badge-future" style={{ marginBottom: '0.5rem' }}>
            Future ML Implementation
          </span>
          <h2 className="section-title">How GeoSSL Will Work</h2>
          <p className="section-subtitle" style={{ maxWidth: '620px', margin: '0 auto' }}>
            Current prototype demonstrates satellite-image comparison and pre-ML environmental analysis. The future GeoSSL implementation will use MAE + ViT to learn useful representations from unlabeled satellite imagery and perform automated environmental-change analysis with limited labeled data.
          </p>
        </div>

        {/* Visual Workflow Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          alignItems: 'stretch',
          marginBottom: '2rem'
        }}>
          {workflowSteps.map((s, index) => {
            const IconComp = s.icon;
            return (
              <div
                key={s.step}
                className="card-clean"
                style={{
                  textAlign: 'center',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#ede9fe',
                    color: '#6d28d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    <IconComp size={18} />
                  </div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.subtitle}
                  </p>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '0.675rem',
                  fontWeight: 600,
                  color: '#6d28d9',
                  background: '#f5f3ff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  Step {s.step}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outputs Preview Box */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 2rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Automated Environmental Outputs:
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🌲 Forest Cover Loss / Gain
            </span>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--urban-gain)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🏙️ Urban & Land-Use Expansion
            </span>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--heat-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🔥 Environmental Heat Vulnerability
            </span>
          </div>
        </div>

        {/* Model Status Transparency Note */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          maxWidth: '780px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.825rem',
          color: '#92400e'
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Status: Proposed ML Architecture (Model Untrained)</strong> — The Masked Autoencoder (MAE) and Vision Transformer (ViT) model has not been trained yet. In this review phase, the system verifies the satellite data ingestion and comparison workflow.
          </div>
        </div>
      </div>
    </section>
  );
}
