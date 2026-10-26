# GeoSSL: Self-Supervised Learning on Satellite Imagery for Label-Efficient Regional Climate Change Monitoring

### Academic Project Evaluation — Functional Prototype

**Study Area:** Raigad District, Maharashtra, India  
**Satellite Sensor:** Sentinel-2 Level-2A Multi-Spectral Instrument (MSI) via Google Earth Engine (GEE)  
**Comparison Epoch:** **2019 (Baseline) → 2025 (Target)**  
**Proposed ML Methodology:** Self-Supervised Learning (SSL) using Masked Autoencoders (MAE) and Vision Transformers (ViT)

---

## 1. Prototype Overview

This repository contains the **Functional Prototype** designed as a user-friendly, presentation-ready environmental monitoring website. It allows an examiner or evaluator to immediately understand the GeoSSL vision through a simple, guided flow:

```text
Home (Landing Overview)
  ↓
Study Region (Raigad, Maharashtra)
  ↓
Satellite Comparison (2019 Satellite Image VS 2025 Satellite Image)
  ↓
Environmental Changes (Forest Change, Urban Expansion, Environmental Heat Indicator)
  ↓
Academic Report (Printable Summary Sheet)
```

---

## 2. Google Earth Engine (GEE) Integration & Data Architecture

GeoSSL programmatically connects to **Google Earth Engine (GEE)** using the official Earth Engine Python API (`earthengine-api`), removing the dependency on manually downloaded satellite files while maintaining a reliable local offline fallback.

```text
React Frontend
      ↓
FastAPI Backend
      ↓
DataProviderManager
   ├── Google Earth Engine (Primary)
   └── Local GeoTIFF Archive (Offline Fallback)
      ↓
Common Analysis Engine
   ├── NDVI (Canopy Index): (B8 - B4) / (B8 + B4)
   ├── NDBI (Built-Up Index): (B11 - B8) / (B11 + B8)
   └── LST (Surface Temp): Landsat TIRS Band 10 (°C)
      ↓
API Response (with Provenance Metadata)
```

### What GEE Provides
* **Sentinel-2 Surface Reflectance Harmonized (`COPERNICUS/S2_SR_HARMONIZED`):**
  * **RGB Preview:** Red (B4), Green (B3), Blue (B2)
  * **Multispectral Bands:** Red (B4), NIR (B8), SWIR-1 (B11)
  * Multi-scene compositing with cloud filtering (`CLOUDY_PIXEL_PERCENTAGE < 20%`).
* **Landsat 8/9 Collection 2 Level 2 (`LANDSAT/LC08/C02/T1_L2`, `LANDSAT/LC09/C02/T1_L2`):**
  * **Thermal Infrared:** Band 10 (`ST_B10`) Surface Temperature
  * Converted to Celsius via USGS scaling:
    $$\text{LST (°C)} = (\text{ST\_B10} \times 0.00341802 + 149.0) - 273.15$$
  * *Note:* Sentinel-2 does not possess a thermal sensor; Landsat TIRS provides authentic radiometric thermal ground measurements.

### Authentication & Environment Variables
The backend securely reads credentials from server environment variables (**never exposed to frontend code**):

| Variable | Description | Requirement |
| :--- | :--- | :--- |
| `EE_PROJECT` | Google Cloud Project ID with Earth Engine API enabled | Required for EE v1.x+ |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud Service Account JSON key | Optional (for server/headless auth) |
| `EE_SERVICE_ACCOUNT` | Service account client email | Optional (with private key) |
| `GEOSSL_PROVIDER_MODE` | Provider mode: `gee` (default) or `local` (forced offline) | Optional |

To authenticate interactively on a developer machine:
```powershell
earthengine authenticate
```
Or create a `.env` file in `backend/` based on `backend/.env.example`.

### How Local GeoTIFF Fallback Works
If Google Earth Engine credentials are not configured, if network connectivity is interrupted, or if `GEOSSL_PROVIDER_MODE=local` is set:
1. `DataProviderManager` detects that GEE is unavailable and sets `is_available: false`.
2. It **automatically falls back** to the local GeoTIFF archive in `backend/data/imagery/{year}/` (`Raigad_{year}_Multispectral.tif`, `Raigad_{year}_LST.tif`, `Raigad_{year}_RGB.tif`).
3. The common analysis engine computes NDVI, NDBI, and LST from the local rasters without interruption.
4. The API response explicitly tags provenance: `data_source: "Local GeoTIFF Archive (backend/data/imagery/)"`.

### Caching
Downloaded previews and spatial reduceRegion statistics are cached under `backend/data/cache/gee/` to eliminate redundant network transfers. The cache directory is ignored by Git.

---

## 3. Local Dataset Files (Fallback Archive)

The local fallback datasets are stored in:
* **2019 Baseline:** `backend/data/imagery/2019/` (`Raigad_2019_RGB.tif`, `Raigad_2019_Multispectral.tif`, `Raigad_2019_LST.tif`)
* **2025 Target:** `backend/data/imagery/2025/` (`Raigad_2025_RGB.tif`, `Raigad_2025_Multispectral.tif`, `Raigad_2025_LST.tif`)

---

## 4. Academic Integrity & Methodological Transparency

- **No Fabricated Model Weights or Metrics:** The Vision Transformer Masked Autoencoder (MAE + ViT) model has **not yet been trained**. The prototype displays zero fake precision, recall, F1, or loss values.
- **Pre-ML Prototype Analysis:** Current environmental change values are computed via standard spectral index comparisons (NDVI for vegetation, NDBI for built-up surface, and a thermal vulnerability proxy) and are explicitly labeled as `[Pre-ML Prototype]`.
- **Environmental Heat Indicator:** Sentinel-2 carries no thermal infrared (TIR) sensor and cannot directly record kinetic surface temperature. Surface temperature is directly computed from **Landsat 8/9 TIRS (Band 10)** in Celsius.
- **Technical Details Off-Screen:** Detailed sensor wavelength tables, MGRS granules, and mathematical formulas are housed in an optional **"Technical Details"** modal so the main presentation remains clean and accessible.

---

## 5. Running the Application

### Start the Python FastAPI Backend
```powershell
cd c:\Users\soham\OneDrive\Documents\GeoSSL_pro\backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Start the React Frontend
```powershell
cd c:\Users\soham\OneDrive\Documents\GeoSSL_pro\frontend
npm install
npm run dev
```
Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## 6. Summary of API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/system/status` | Returns system phase and model training status. |
| `GET` | `/api/v1/system/gee-status` | Diagnostic endpoint for GEE and local fallback connectivity. |
| `GET` | `/api/v1/regions` | Returns Raigad bounds, centroid, and talukas. |
| `GET` | `/api/v1/imagery/compare` | Query params: `region_id=raigad`, `base_year=2019`, `target_year=2025`. Returns imagery metadata and active data provider. |
| `POST` | `/api/v1/analyze` | Request body: `{ "region_id": "raigad", "base_year": 2019, "target_year": 2025 }`. Returns Forest (NDVI), Urban (NDBI), and Heat (LST) indicators with data source provenance. |
| `GET` | `/api/v1/reports/summary` | Generates a structured academic project review report. |

---

## 7. How the Future MAE + ViT Model Plugs In

The backend uses an abstract adapter interface `BaseChangeAnalyzer`:
1. `PrototypeAnalysisEngine` (Active): Computes deterministic multi-spectral and thermal baseline deltas.
2. `GeoSSLMAEAnalysisEngine` (Future): Defines the contract for the ViT encoder ($16 \times 16$ patches, ~75% masking) trained on unlabeled Sentinel-2 imagery.
When model training completes, changing `ANALYSIS_ENGINE_TYPE = "mae_vit"` in `backend/app/core/config.py` enables automated AI inference with **zero modifications to the React website**.

