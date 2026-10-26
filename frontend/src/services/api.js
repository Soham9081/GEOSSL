const API_BASE = '/api/v1';

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/system/status`);
  if (!res.ok) throw new Error(`Failed to load system status: ${res.statusText}`);
  return res.json();
}

export async function fetchRegions() {
  const res = await fetch(`${API_BASE}/regions`);
  if (!res.ok) throw new Error(`Failed to load regions: ${res.statusText}`);
  return res.json();
}

export async function fetchImagery(regionId = 'raigad', year = 2019) {
  const res = await fetch(`${API_BASE}/imagery?region_id=${regionId}&year=${year}`);
  if (!res.ok) throw new Error(`Failed to load imagery: ${res.statusText}`);
  return res.json();
}

export async function fetchImageryComparison(regionId = 'raigad', baseYear = 2019, targetYear = 2025, studyRegion = null) {
  let url = `${API_BASE}/imagery/compare?region_id=${regionId}&base_year=${baseYear}&target_year=${targetYear}`;
  if (studyRegion?.bbox) {
    const [minLon, minLat, maxLon, maxLat] = studyRegion.bbox;
    url += `&min_lat=${minLat}&max_lat=${maxLat}&min_lon=${minLon}&max_lon=${maxLon}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load imagery comparison: ${res.statusText}`);
  return res.json();
}

export async function analyzeEnvironmentalChanges(payload = { region_id: 'raigad', base_year: 2019, target_year: 2025 }) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAcademicReport(regionId = 'raigad', baseYear = 2019, targetYear = 2025) {
  const res = await fetch(`${API_BASE}/reports/summary?region_id=${regionId}&base_year=${baseYear}&target_year=${targetYear}`);
  if (!res.ok) throw new Error(`Failed to load academic report: ${res.statusText}`);
  return res.json();
}
