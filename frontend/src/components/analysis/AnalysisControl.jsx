import React from 'react';
import { Play, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function AnalysisControl({ onAnalyze, isLoading, analysisResult }) {
  return (
    <div className="card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-main) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary-700)" />
            <h3 style={{ fontSize: '1.1rem' }}>Regional Change Detection Hub</h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Triggers the backend's <code className="mono">BaseChangeAnalyzer</code> engine to evaluate temporal shifts between 2018 and 2024.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {analysisResult && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div>Engine: <strong>{analysisResult.analysis_engine}</strong></div>
              <div className="mono">Latency: {analysisResult.execution_time_ms} ms</div>
            </div>
          )}

          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing Ingestion & Indices...</span>
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span>Analyze Environmental Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ 
        marginTop: '0.875rem', 
        padding: '0.625rem 0.875rem', 
        background: '#fff', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        fontSize: '0.775rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
          <AlertCircle size={14} color="var(--primary-700)" />
          <span>Active Pipeline: <strong>Prototype Spectral Index Engine</strong></span>
        </div>
        <ProvenanceBadge type="prototype" label="Pre-ML Prototype Engine Active" />
      </div>
    </div>
  );
}
