import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import HeroSection from './components/home/HeroSection';
import SelectStudyLocation, { DEFAULT_RAIGAD_REGION } from './components/location/SelectStudyLocation';
import SatelliteComparisonSection from './components/viewer/SatelliteComparisonSection';
import ResultsSection from './components/analysis/ResultsSection';
import TechnicalModal from './components/technical/TechnicalModal';
import ReportModal from './components/report/ReportModal';
import {
  fetchSystemStatus,
  fetchImageryComparison,
  analyzeEnvironmentalChanges,
  fetchAcademicReport
} from './services/api';

export default function App() {
  const baseYear = 2019;
  const targetYear = 2025;

  // Selected study region preserved in frontend state
  const [studyRegion, setStudyRegion] = useState(() => {
    try {
      const saved = localStorage.getItem('geossl_study_region');
      return saved ? JSON.parse(saved) : DEFAULT_RAIGAD_REGION;
    } catch {
      return DEFAULT_RAIGAD_REGION;
    }
  });

  // Page routing state: 'home' | 'select-location' | 'comparison' | 'results'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'select-location', 'comparison', 'results'].includes(hash) ? hash : 'home';
  });

  const [systemStatus, setSystemStatus] = useState(null);
  const [imageryData, setImageryData] = useState(null);
  const [isImageryLoading, setIsImageryLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [notification, setNotification] = useState(null);

  // Synchronize hash with currentPage
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'select-location', 'comparison', 'results'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle continuing from Select Study Location page to Satellite Comparison
  const handleContinueFromLocation = async (selectedRegionData) => {
    if (!selectedRegionData || !selectedRegionData.bbox) return;
    setStudyRegion(selectedRegionData);
    try {
      localStorage.setItem('geossl_study_region', JSON.stringify(selectedRegionData));
    } catch (e) {
      console.warn("Could not persist to localStorage:", e);
    }
    navigateTo('comparison');
    setIsImageryLoading(true);
    try {
      const comparison = await fetchImageryComparison('raigad', baseYear, targetYear, selectedRegionData);
      setImageryData(comparison);
    } catch (err) {
      console.warn("Imagery fetch for selected region failed:", err);
      setImageryData(null);
    } finally {
      setIsImageryLoading(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      setIsImageryLoading(true);
      try {
        const [status, comparison, analysis] = await Promise.all([
          fetchSystemStatus().catch(err => { console.warn("Backend status:", err); return null; }),
          fetchImageryComparison('raigad', baseYear, targetYear, studyRegion).catch(err => { console.warn("Imagery:", err); return null; }),
          analyzeEnvironmentalChanges({
            region_id: 'raigad',
            base_year: baseYear,
            target_year: targetYear,
            indicators: ['forest', 'urban', 'heat']
          }).catch(err => { console.warn("Analysis:", err); return null; })
        ]);
        setSystemStatus(status);
        setImageryData(comparison);
        if (analysis) {
          setAnalysisResult(analysis);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsImageryLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle "Analyze Environmental Changes" Action from Page 2
  const handleCompareChanges = async () => {
    setIsAnalyzing(true);
    setNotification(null);
    try {
      const res = await analyzeEnvironmentalChanges({
        region_id: 'raigad',
        base_year: baseYear,
        target_year: targetYear,
        indicators: ['forest', 'urban', 'heat']
      });
      setAnalysisResult(res);
      navigateTo('results');
    } catch (err) {
      setNotification(`Error running analysis: ${err.message}`);
      navigateTo('results');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle "Generate Academic Report" Action
  const handleOpenReport = async () => {
    try {
      const rep = await fetchAcademicReport('raigad', baseYear, targetYear);
      setReportData(rep);
      setIsReportOpen(true);
    } catch (err) {
      setNotification(`Could not generate academic report: ${err.message}`);
    }
  };

  return (
    <div className="site-wrapper">
      {/* 1. Persistent Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Optional Notification Toast */}
      {notification && (
        <div style={{
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          color: '#991b1b',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem'
        }}>
          {notification}
        </div>
      )}

      {/* Main Page Routing */}
      <main style={{ flex: 1 }}>
        {/* PAGE 1: HOME */}
        {currentPage === 'home' && (
          <HeroSection
            onStartAnalysis={() => navigateTo('select-location')}
          />
        )}

        {/* PAGE 2: SELECT STUDY LOCATION */}
        {currentPage === 'select-location' && (
          <SelectStudyLocation
            initialRegion={studyRegion}
            onContinue={handleContinueFromLocation}
          />
        )}

        {/* PAGE 3: SATELLITE COMPARISON */}
        {currentPage === 'comparison' && (
          <SatelliteComparisonSection
            baseYear={baseYear}
            targetYear={targetYear}
            baseImageData={imageryData?.base_year}
            targetImageData={imageryData?.target_year}
            onCompareChanges={handleCompareChanges}
            isAnalyzing={isAnalyzing}
            studyRegion={studyRegion}
            isLoading={isImageryLoading}
          />
        )}

        {/* PAGE 4: ENVIRONMENTAL CHANGES */}
        {currentPage === 'results' && (
          <ResultsSection
            analysisData={analysisResult}
            onOpenReport={handleOpenReport}
            onBackToComparison={() => navigateTo('comparison')}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 0',
        marginTop: 'auto',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--primary-950)' }}>GeoSSL Project</strong> • Functional Prototype
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigateTo('home')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('select-location')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Select Study Location
            </button>
            <button
              onClick={() => navigateTo('comparison')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Satellite Comparison
            </button>
            <button
              onClick={() => navigateTo('results')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Environmental Changes
            </button>
          </div>
        </div>
      </footer>

      {/* Technical Details Modal */}
      <TechnicalModal
        isOpen={isTechnicalOpen}
        onClose={() => setIsTechnicalOpen(false)}
      />

      {/* Academic Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={reportData}
      />
    </div>
  );
}
