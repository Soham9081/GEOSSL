import React from 'react';

export default function ProvenanceBadge({ type = 'prototype', label }) {
  if (type === 'prototype') {
    return (
      <span className="badge badge-prototype" title="Heuristic spectral calculation prior to trained ML model">
        {label || 'Pre-ML Prototype'}
      </span>
    );
  }
  if (type === 'real') {
    return (
      <span className="badge badge-real" title="Direct Sentinel-2 / Geospatial parameter">
        {label || 'Actual Pipeline'}
      </span>
    );
  }
  if (type === 'future') {
    return (
      <span className="badge badge-future" title="Planned feature for MAE + ViT model integration">
        {label || 'Future MAE+ViT'}
      </span>
    );
  }
  if (type === 'warning') {
    return (
      <span className="badge badge-warning" title="Sensor physical limitation">
        {label || 'Non-TIR Proxy'}
      </span>
    );
  }
  return <span className="badge">{label}</span>;
}
