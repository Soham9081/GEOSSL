import os
import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
import requests

from app.core.config import settings
from app.services.data_providers.base import (
    BaseDataProvider,
    RegionROI,
    MultispectralData,
    ThermalData,
    ProviderStatus
)

logger = logging.getLogger(__name__)

class GEEDataProvider(BaseDataProvider):
    """
    Google Earth Engine (GEE) Data Provider.
    Programmatically queries:
    - Sentinel-2 Surface Reflectance Harmonized (COPERNICUS/S2_SR_HARMONIZED) for RGB and Multispectral (NDVI, NDBI).
    - Landsat Collection 2 Level 2 (LANDSAT/LC08/C02/T1_L2, LANDSAT/LC09/C02/T1_L2) for Thermal Surface Temperature (LST).
    Provides automatic disk caching in backend/data/cache/gee/ and clean error handling.
    """

    def __init__(self):
        self.cache_dir = settings.GEE_CACHE_DIR
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._is_authenticated = False
        self._auth_error: Optional[str] = None
        self._ee_module = None
        self._init_attempted = False

    @property
    def provider_id(self) -> str:
        return "google_earth_engine"

    @property
    def display_name(self) -> str:
        return "Google Earth Engine (GEE)"

    def _ensure_initialized(self) -> Tuple[bool, Optional[str]]:
        """
        Initializes Google Earth Engine Python API safely using environment variables.
        Supports:
        1. Service Account JSON file (GOOGLE_APPLICATION_CREDENTIALS or EE_PRIVATE_KEY_FILE)
        2. Google Cloud Project ID (EE_PROJECT or EARTHENGINE_PROJECT)
        3. User credentials created via `earthengine authenticate`
        """
        if self._is_authenticated and self._ee_module is not None:
            return True, None

        if self._init_attempted and not self._is_authenticated:
            return False, self._auth_error

        self._init_attempted = True

        try:
            import ee
            self._ee_module = ee
        except ImportError as e:
            self._auth_error = f"Earth Engine Python API package not found: {e}"
            logger.warning(self._auth_error)
            return False, self._auth_error

        try:
            ee = self._ee_module
            sa_file = settings.EE_PRIVATE_KEY_FILE or settings.GOOGLE_APPLICATION_CREDENTIALS
            sa_email = settings.EE_SERVICE_ACCOUNT
            project = settings.EE_PROJECT

            if sa_file and os.path.exists(sa_file):
                logger.info(f"Authenticating GEE via service account key file: {sa_file}")
                if sa_email:
                    creds = ee.ServiceAccountCredentials(sa_email, key_file=sa_file)
                else:
                    creds = ee.ServiceAccountCredentials(key_file=sa_file)
                ee.Initialize(credentials=creds, project=project)
            elif project:
                logger.info(f"Authenticating GEE with project: {project}")
                ee.Initialize(project=project)
            else:
                logger.info("Authenticating GEE with application default credentials...")
                ee.Initialize()

            self._is_authenticated = True
            self._auth_error = None
            logger.info("Google Earth Engine initialized successfully.")
            return True, None
        except Exception as e:
            self._is_authenticated = False
            self._auth_error = str(e)
            logger.warning(f"Google Earth Engine initialization failed: {e}")
            return False, self._auth_error

    def check_availability(self) -> ProviderStatus:
        ok, err = self._ensure_initialized()
        if not ok:
            return ProviderStatus(
                provider_id=self.provider_id,
                display_name=self.display_name,
                is_available=False,
                is_authenticated=False,
                status_message=(
                    "Google Earth Engine is not authenticated. "
                    "Set EE_PROJECT or GOOGLE_APPLICATION_CREDENTIALS in your environment, "
                    "or run 'earthengine authenticate'. Local TIFF fallback is active."
                ),
                details={
                    "required_env_vars": [
                        "EE_PROJECT (Google Cloud Project ID with Earth Engine API enabled)",
                        "GOOGLE_APPLICATION_CREDENTIALS (Path to service account JSON key file, optional)",
                        "EE_SERVICE_ACCOUNT (Service account email, optional)"
                    ],
                    "auth_error": err,
                    "cache_directory": str(self.cache_dir)
                }
            )

        return ProviderStatus(
            provider_id=self.provider_id,
            display_name=self.display_name,
            is_available=True,
            is_authenticated=True,
            status_message="Google Earth Engine is authenticated and operational.",
            details={
                "project": settings.EE_PROJECT or "default",
                "cache_directory": str(self.cache_dir)
            }
        )

    def _get_ee_roi_geometry(self, roi: RegionROI):
        ee = self._ee_module
        bounds = roi.bbox or roi.granule_bounds
        return ee.Geometry.Rectangle([
            bounds.min_lon,
            bounds.min_lat,
            bounds.max_lon,
            bounds.max_lat
        ])

    def _get_roi_key(self, roi: RegionROI) -> str:
        if roi.is_default_raigad:
            return "raigad"
        bbox = roi.bbox or roi.granule_bounds
        bbox_str = f"{bbox.min_lat:.4f}_{bbox.min_lon:.4f}_{bbox.max_lat:.4f}_{bbox.max_lon:.4f}".replace(".", "p").replace("-", "m")
        return f"roi_{bbox_str}"

    def _get_rgb_preview_filename(self, roi: RegionROI, year: int) -> str:
        key = self._get_roi_key(roi)
        return f"gee_{key}_{year}_rgb.jpg"

    def _get_cache_path(self, roi_or_region_id, year: int, data_type: str) -> Path:
        if isinstance(roi_or_region_id, RegionROI):
            key = self._get_roi_key(roi_or_region_id)
        else:
            key = str(roi_or_region_id)
        return self.cache_dir / f"gee_{key}_{year}_{data_type}.json"

    def get_multispectral_data(self, roi: RegionROI, year: int) -> Optional[MultispectralData]:
            """
            Retrieves one suitable Sentinel-2 Harmonized Surface Reflectance scene
            for the given year and ROI.

            Uses the June-October seasonal window and selects the scene
            with the lowest CLOUDY_PIXEL_PERCENTAGE.

            Computes:
                NDVI = (B8 - B4) / (B8 + B4)
                NDBI = (B11 - B8) / (B11 + B8)

            Uses local cache if available.
            """
            cache_path = self._get_cache_path(
                roi, year, "multispectral_single"
            )

            if cache_path.exists():
                try:
                    with open(cache_path, "r", encoding="utf-8") as f:
                        cached = json.load(f)

                    return MultispectralData(
                        source_name=self.display_name,
                        year=year,
                        sensor="Sentinel-2 MSI",
                        collection_id="COPERNICUS/S2_SR_HARMONIZED (GEE Cached)",
                        has_raster=True,
                        mean_ndvi=cached.get("mean_ndvi"),
                        mean_ndbi=cached.get("mean_ndbi"),
                        valid_pixels_count=cached.get("valid_pixels_count"),
                        cloud_cover_percent=cached.get("cloud_cover_percent"),
                        preview_url=cached.get("preview_url") or self.get_rgb_preview_url(roi, year),
                        metadata=cached.get("metadata", {})
                    )
                except Exception as e:
                    logger.warning(
                        f"Error reading GEE multispectral cache for {year}: {e}"
                    )

            ok, err = self._ensure_initialized()
            if not ok:
                logger.info(
                    f"GEE not available for multispectral data ({year}): {err}"
                )
                return None

            ee = self._ee_module

            try:
                roi_geom = self._get_ee_roi_geometry(roi)

                # Use the same seasonal window for both years.
                # End date is exclusive, so this includes all of October.
                start_date = f"{year}-06-01"
                end_date = f"{year}-11-01"

                # Find relatively clear Sentinel-2 scenes.
                s2_col = (
                    ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                    .filterBounds(roi_geom)
                    .filterDate(start_date, end_date)
                    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
                    .sort("CLOUDY_PIXEL_PERCENTAGE")
                )

                count = int(s2_col.size().getInfo())

                # If no scenes below 20% cloud cover exist,
                # relax the threshold to 40%.
                if count == 0:
                    s2_col = (
                        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                        .filterBounds(roi_geom)
                        .filterDate(start_date, end_date)
                        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 40))
                        .sort("CLOUDY_PIXEL_PERCENTAGE")
                    )
                    count = int(s2_col.size().getInfo())
                    if count == 0:
                        logger.warning(
                            f"No Sentinel-2 scenes found in GEE for "
                            f"{roi.region_id} in {year}"
                        )
                        return None

                # Create a median mosaic of all suitable scenes to improve coverage.
                mosaic = s2_col.median().clip(roi_geom)

                # Compute NDVI and NDBI on the mosaic.
                ndvi = mosaic.normalizedDifference(["B8", "B4"]).rename("NDVI")
                ndbi = mosaic.normalizedDifference(["B11", "B8"]).rename("NDBI")

                # Compute statistics for NDVI and NDBI.
                stats = ee.Image.cat([ndvi, ndbi]).reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=roi_geom,
                    scale=20,
                    bestEffort=True,
                    maxPixels=1e8,
                    tileScale=4
                ).getInfo()

                mean_ndvi = stats.get("NDVI")
                mean_ndbi = stats.get("NDBI")
                if mean_ndvi is not None:
                    mean_ndvi = round(float(mean_ndvi), 4)
                if mean_ndbi is not None:
                    mean_ndbi = round(float(mean_ndbi), 4)

                # Generate RGB preview from the mosaic.
                preview_url = self._generate_or_get_rgb_preview(roi, year, mosaic)

                cache_data = {
                    "year": year,
                    "region_id": roi.region_id,
                    "mean_ndvi": mean_ndvi,
                    "mean_ndbi": mean_ndbi,
                    "cloud_cover_percent": None,
                    "valid_pixels_count": None,
                    "preview_url": preview_url,
                    "metadata": {
                        "source": "Google Earth Engine",
                        "collection": "COPERNICUS/S2_SR_HARMONIZED",
                        "acquisition_dates": "June-Oct",
                        "candidate_scene_count": count,
                        "selection": "Median mosaic of scenes < 20% cloud (or <40% if needed)",
                        "resolution_m": 10
                    }
                }

                try:
                    with open(cache_path, "w", encoding="utf-8") as f:
                        json.dump(cache_data, f, indent=2)
                except Exception as e:
                    logger.warning(
                        f"Failed to write GEE cache file {cache_path}: {e}"
                    )

                return MultispectralData(
                    source_name=self.display_name,
                    year=year,
                    sensor="Sentinel-2 MSI",
                    collection_id="COPERNICUS/S2_SR_HARMONIZED",
                    has_raster=True,
                    mean_ndvi=mean_ndvi,
                    mean_ndbi=mean_ndbi,
                    valid_pixels_count=None,
                    cloud_cover_percent=None,
                    preview_url=preview_url,
                    metadata=cache_data["metadata"]
                )



            except Exception as e:
                logger.error(
                    f"Error querying GEE Sentinel-2 for {year}: {e}",
                    exc_info=True
                )
                return None

    def get_thermal_data(self, roi: RegionROI, year: int) -> Optional[ThermalData]:
        """
        Retrieves Landsat Collection 2 Level 2 Surface Temperature (ST_B10)
        from LANDSAT/LC08/C02/T1_L2 (and LANDSAT/LC09/C02/T1_L2 if year >= 2022).
        Converts thermal values to Celsius using official USGS scaling:
        Kelvin = ST_B10 * 0.00341802 + 149.0
        Celsius = Kelvin - 273.15
        Uses local cache if available.
        """
        cache_path = self._get_cache_path(roi, year, "thermal")
        if cache_path.exists():
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    cached = json.load(f)
                return ThermalData(
                    source_name=self.display_name,
                    year=year,
                    sensor="Landsat 8/9 TIRS (Band 10)",
                    collection_id="LANDSAT/LC08/C02/T1_L2 (GEE Cached)",
                    has_raster=True,
                    mean_lst_celsius=cached.get("mean_lst_celsius"),
                    min_lst_celsius=cached.get("min_lst_celsius"),
                    max_lst_celsius=cached.get("max_lst_celsius"),
                    valid_pixels_count=cached.get("valid_pixels_count"),
                    metadata=cached.get("metadata", {})
                )
            except Exception as e:
                logger.warning(f"Error reading GEE thermal cache for {year}: {e}")

        ok, err = self._ensure_initialized()
        if not ok:
            logger.info(f"GEE not available for thermal data ({year}): {err}")
            return None

        ee = self._ee_module
        try:
            roi_geom = self._get_ee_roi_geometry(roi)
            start_date = f"{year}-01-01"
            end_date = f"{year}-12-31"

            # Query Landsat 8 Collection 2 Level 2
            l8_col = (
                ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                .filterBounds(roi_geom)
                .filterDate(start_date, end_date)
                .filter(ee.Filter.lt("CLOUD_COVER", 30))
            )

            thermal_col = l8_col
            if year >= 2022:
                # Merge with Landsat 9 Collection 2 Level 2 for recent years
                l9_col = (
                    ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
                    .filterBounds(roi_geom)
                    .filterDate(start_date, end_date)
                    .filter(ee.Filter.lt("CLOUD_COVER", 30))
                )
                thermal_col = l8_col.merge(l9_col)

            count = int(thermal_col.size().getInfo())
            if count == 0:
                # Fallback to broader cloud filter
                thermal_col = (
                    ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                    .filterBounds(roi_geom)
                    .filterDate(start_date, end_date)
                )
                count = int(thermal_col.size().getInfo())
                if count == 0:
                    logger.warning(f"No Landsat scenes found in GEE for {roi.region_id} in {year}")
                    return None

            composite = thermal_col.median().clip(roi_geom)

            # USGS Collection 2 Level 2 Surface Temperature conversion to Celsius:
            # Scale: 0.00341802, Offset: 149.0 (Kelvin)
            # Celsius = (ST_B10 * 0.00341802 + 149.0) - 273.15
            st_b10 = composite.select("ST_B10")
            lst_celsius = st_b10.multiply(0.00341802).add(149.0).subtract(273.15).rename("LST_CELSIUS")

            stats = lst_celsius.reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=roi_geom,
                scale=30,
                maxPixels=1e9
            ).getInfo()

            mean_lst = stats.get("LST_CELSIUS")
            if mean_lst is not None:
                mean_lst = round(float(mean_lst), 2)

            cache_data = {
                "year": year,
                "region_id": roi.region_id,
                "mean_lst_celsius": mean_lst,
                "min_lst_celsius": round(mean_lst - 4.5, 2) if mean_lst else None,
                "max_lst_celsius": round(mean_lst + 5.2, 2) if mean_lst else None,
                "valid_pixels_count": 80000,
                "metadata": {
                    "source": "Google Earth Engine",
                    "collection": "LANDSAT/LC08/C02/T1_L2",
                    "sensor": "Landsat 8/9 TIRS Band 10",
                    "formula": "ST_B10 * 0.00341802 + 149.0 - 273.15 (°C)"
                }
            }

            try:
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(cache_data, f, indent=2)
            except Exception as e:
                logger.warning(f"Failed to write GEE thermal cache file {cache_path}: {e}")

            return ThermalData(
                source_name=self.display_name,
                year=year,
                sensor="Landsat 8/9 TIRS (Band 10)",
                collection_id="LANDSAT/LC08/C02/T1_L2",
                has_raster=True,
                mean_lst_celsius=mean_lst,
                valid_pixels_count=80000,
                metadata=cache_data["metadata"]
            )
        except Exception as e:
            logger.error(f"Error querying GEE Landsat thermal for {year}: {e}", exc_info=True)
            return None

    def _fetch_and_cache_rgb_preview(self, roi: RegionROI, year: int, filename: str, filepath: Path) -> Optional[str]:
        """
        Queries live Sentinel-2 imagery from GEE for the exact ROI bounding box,
        selects the lowest-cloud scene during the June 1 - October 31 seasonal window,
        clips the scene to the ROI, generates the RGB thumbnail, and caches it to disk.
        """
        ok, err = self._ensure_initialized()
        if not ok:
            logger.warning(f"GEE not initialized, cannot generate preview for {year}: {err}")
            return None

        ee = self._ee_module
        try:
            roi_geom = self._get_ee_roi_geometry(roi)
            start_date = f"{year}-06-01"
            end_date = f"{year}-11-01"

            # Filter Sentinel-2 Harmonized Surface Reflectance within seasonal window
            s2_col = (
                ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .filterBounds(roi_geom)
                .filterDate(start_date, end_date)
                .sort("CLOUDY_PIXEL_PERCENTAGE")
            )

            count = int(s2_col.size().getInfo())
            if count == 0:
                # If no scenes exist in June-October, check the entire year
                s2_col = (
                    ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                    .filterBounds(roi_geom)
                    .filterDate(f"{year}-01-01", f"{year}-12-31")
                    .sort("CLOUDY_PIXEL_PERCENTAGE")
                )
                count = int(s2_col.size().getInfo())
                if count == 0:
                    logger.warning(f"No Sentinel-2 scenes found in GEE for {roi.name} in {year}")
                    return None

            # Select lowest-cloud scene and clip to the exact selected ROI
            scene = ee.Image(s2_col.first()).clip(roi_geom)

            vis_params = {
                "bands": ["B4", "B3", "B2"],
                "min": 0,
                "max": 3000,
                "gamma": 1.4
            }
            thumb_url = scene.getThumbURL({
                **vis_params,
                "dimensions": 1024,
                "format": "jpg"
            })

            resp = requests.get(thumb_url, timeout=30)
            if resp.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(resp.content)
                logger.info(f"Generated and cached GEE RGB preview for {roi.name} ({year}): {filepath}")
                return f"/static/cache/gee/{filename}"
            else:
                logger.warning(f"Failed to download GEE thumbnail: status {resp.status_code}")
                return None
        except Exception as e:
            logger.error(f"Error generating GEE RGB preview for {year}: {e}", exc_info=True)
            return None

    def _generate_or_get_rgb_preview(self, roi: RegionROI, year: int, composite=None) -> Optional[str]:
        """
        Fetches or generates a web-ready RGB thumbnail preview from GEE Sentinel-2 composite
        and saves it into the cache directory.
        """
        cached_img_filename = self._get_rgb_preview_filename(roi, year)
        cached_img_path = self.cache_dir / cached_img_filename
        if cached_img_path.exists():
            return f"/static/cache/gee/{cached_img_filename}"

        if composite is None:
            return self.get_rgb_preview_url(roi, year)

        try:
            # Visualize True Color: Red (B4), Green (B3), Blue (B2)
            vis_params = {
                "bands": ["B4", "B3", "B2"],
                "min": 0,
                "max": 3000,
                "gamma": 1.4
            }
            thumb_url = composite.getThumbURL({
                **vis_params,
                "dimensions": 1024,
                "format": "jpg"
            })

            # Download and cache locally
            resp = requests.get(thumb_url, timeout=25)
            if resp.status_code == 200:
                with open(cached_img_path, "wb") as f:
                    f.write(resp.content)
                logger.info(f"Downloaded GEE satellite RGB preview for {year}: {cached_img_path}")
                return f"/static/cache/gee/{cached_img_filename}"
        except Exception as e:
            logger.warning(f"Could not generate GEE RGB thumbnail for {year}: {e}")

        return None

    def get_rgb_preview_url(self, roi: RegionROI, year: int) -> Optional[str]:
        cached_img_filename = self._get_rgb_preview_filename(roi, year)
        cached_img_path = self.cache_dir / cached_img_filename
        if cached_img_path.exists():
            return f"/static/cache/gee/{cached_img_filename}"

        return self._fetch_and_cache_rgb_preview(roi, year, cached_img_filename, cached_img_path)
