import React from 'react';
import { Globe } from 'lucide-react';

export default function Navbar({ currentPage = 'home', onNavigate }) {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="brand-logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{
            background: 'var(--primary-800)',
            color: '#ffffff',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Globe size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--primary-950)' }}>
              GeoSSL
            </div>
            <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prototype
            </div>
          </div>
        </button>

        {/* 4 Main Navigation Links */}
        <div className="nav-links">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
                    {/* Select Study Location navigation removed */}
          <button
            onClick={() => onNavigate('comparison')}
            className={`nav-link ${currentPage === 'comparison' ? 'active' : ''}`}
          >
            Satellite Comparison
          </button>
          <button
            onClick={() => onNavigate('results')}
            className={`nav-link ${currentPage === 'results' ? 'active' : ''}`}
          >
            Environmental Changes
          </button>
        </div>
      </div>
    </nav>
  );
}
