import React from 'react';
import { Cpu, Grid, EyeOff, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function MAEArchitecture() {
  const pipelineSteps = [
    {
      title: "1. Multispectral Patchification",
      desc: "Sentinel-2 MSI Level-2A imagery is divided into non-overlapping 16×16 pixel patches across all 12 spectral bands (C=12, H=16, W=16).",
      icon: Grid,
      badge: "16×16 Tokens"
    },
    {
      title: "2. High-Ratio Spatial Masking (~75%)",
      desc: "Approximately 75% of spatial patches are randomly masked. Only the remaining 25% unmasked patches are encoded, creating a challenging self-supervised pretext task.",
      icon: EyeOff,
      badge: "75% Masking Ratio"
    },
    {
      title: "3. Vision Transformer (ViT) Encoder",
      desc: "Standard ViT-Base encoder processes visible patch tokens with multi-head self-attention, learning cross-band and contextual geospatial representations without any human labels.",
      icon: Cpu,
      badge: "ViT-Base Backbone"
    },
    {
      title: "4. Unlabeled Sentinel-2 Pretraining",
      desc: "A lightweight decoder reconstructs the masked 75% patches using pixel MSE loss. Self-supervision leverages abundant unlabeled satellite archives over Maharashtra.",
      icon: Layers,
      badge: "Self-Supervised (SSL)"
    },
    {
      title: "5. Label-Efficient Downstream Tuning",
      desc: "The pretrained ViT encoder weights are frozen or fine-tuned using very few ground-truth labels for Raigad forest loss and urban expansion segmentation.",
      icon: Sparkles,
      badge: "Label-Efficient"
    }
  ];

  return (
    <div className="card" style={{ marginTop: '1.5rem', border: '1px solid #c7d2fe', background: '#fcfdff' }}>
      <div className="card-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#4338ca" />
            <h3 style={{ fontSize: '1.05rem', color: '#312e81' }}>
              Future ML Architecture: Self-Supervised Masked Autoencoder (MAE) + Vision Transformer (ViT)
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Proposed methodology specification for the final-year project (pretraining & fine-tuning phase)
          </p>
        </div>
        <ProvenanceBadge type="future" label="Status: Future / Untrained" />
      </div>

      <div style={{
        background: '#eef2ff',
        border: '1px solid #c7d2fe',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        marginBottom: '1.25rem',
        fontSize: '0.8rem',
        color: '#3730a3',
        lineHeight: '1.45'
      }}>
        <strong>Academic Milestone Status:</strong> The complete MAE + ViT model is <strong>not yet trained</strong>. 
        In this prototype, the system architecture and API contracts are fully established via <code className="mono">BaseChangeAnalyzer</code> 
        so that once the PyTorch weights checkpoint is produced, it will plug into the backend with zero frontend redesign.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {pipelineSteps.map((step, idx) => {
          const IconComp = step.icon;
          return (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{
                    background: '#ede9fe',
                    color: '#6d28d9',
                    padding: '0.35rem',
                    borderRadius: '6px'
                  }}>
                    <IconComp size={16} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4338ca', background: '#e0e7ff', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {step.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {step.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                <CheckCircle2 size={12} color="#10b981" />
                <span>Architecture Contract Defined</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
