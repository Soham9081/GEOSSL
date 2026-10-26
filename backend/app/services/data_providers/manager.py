import logging
from typing import Optional, Dict, Any, Tuple

from app.core.config import settings
from app.services.data_providers.base import (
    RegionROI,
    BoundingBox,
    Centroid,
    MultispectralData,
    ThermalData,
    ProviderStatus
)
from app.services.data_providers.local_provider import LocalDataProvider
from app.services.data_providers.gee_provider import GEEDataProvider

logger = logging.getLogger(__name__)

class DataProviderManager:
    """
    Unified Data Provider Orchestrator.
    Manages Google Earth Engine (primary) and Local GeoTIFF Archive (fallback).
    Ensures zero downtime and continuous scientific analysis regardless of network or authentication status.
    """

    def __init__(self):
        self.gee_provider = GEEDataProvider()
        self.local_provider = LocalDataProvider()

    def get_region_roi(self, region_id: str = "raigad") -> RegionROI:
        """
        Creates or retrieves RegionROI specification for the study area.
        Designed to allow future user-drawn or dynamic ROIs while defaulting to Raigad District.
        """
        raw = settings.DEFAULT_REGION_ROI
        centroid = Centroid(lat=raw["centroid"]["lat"], lon=raw["centroid"]["lon"])
        bbox = BoundingBox(
            min_lat=raw["bbox"]["min_lat"],
            max_lat=raw["bbox"]["max_lat"],
            min_lon=raw["bbox"]["min_lon"],
            max_lon=raw["bbox"]["max_lon"]
        )
        granule = BoundingBox(
            min_lat=raw["granule_bounds"]["min_lat"],
            max_lat=raw["granule_bounds"]["max_lat"],
            min_lon=raw["granule_bounds"]["min_lon"],
            max_lon=raw["granule_bounds"]["max_lon"]
        )
        return RegionROI(
            region_id=region_id,
            name=raw.get("name", "Raigad District"),
            state=raw.get("state", "Maharashtra"),
            country=raw.get("country", "India"),
            centroid=centroid,
            bbox=bbox,
            granule_bounds=granule
        )

    def get_multispectral_data(self, roi: RegionROI, year: int) -> Tuple[Optional[MultispectralData], str]:
        """
        Attempts to acquire multispectral data from GEE first.
        If unavailable, automatically falls back to LocalDataProvider.
        Returns: (data, active_source_name)
        """
        # 1. Try Google Earth Engine if enabled and not in forced local mode
        if settings.GEE_ENABLED and settings.DATA_PROVIDER_MODE != "local":
            try:
                data = self.gee_provider.get_multispectral_data(roi, year)
                if data is not None:
                    return data, "Google Earth Engine (COPERNICUS/S2_SR_HARMONIZED)"
            except Exception as e:
                logger.warning(f"GEE multispectral retrieval failed for {year}, falling back to local archive: {e}")

        # 2. Fallback to Local GeoTIFF Archive
        local_data = self.local_provider.get_multispectral_data(roi, year)
        return local_data, "Local GeoTIFF Archive (backend/data/imagery/)"

    def get_thermal_data(self, roi: RegionROI, year: int) -> Tuple[Optional[ThermalData], str]:
        """
        Attempts to acquire thermal LST data from GEE Landsat product first.
        If unavailable, automatically falls back to LocalDataProvider.
        Returns: (data, active_source_name)
        """
        # 1. Try Google Earth Engine if enabled and not in forced local mode
        if settings.GEE_ENABLED and settings.DATA_PROVIDER_MODE != "local":
            try:
                data = self.gee_provider.get_thermal_data(roi, year)
                if data is not None:
                    return data, "Google Earth Engine (LANDSAT/LC08/C02/T1_L2)"
            except Exception as e:
                logger.warning(f"GEE thermal retrieval failed for {year}, falling back to local archive: {e}")

        # 2. Fallback to Local GeoTIFF Archive
        local_data = self.local_provider.get_thermal_data(roi, year)
        return local_data, "Local GeoTIFF Archive (backend/data/imagery/)"

    def get_rgb_preview_url(self, roi: RegionROI, year: int) -> Optional[str]:
        """
        Returns web RGB preview URL (from GEE or local static imagery).
        """
        if settings.GEE_ENABLED and settings.DATA_PROVIDER_MODE != "local":
            try:
                preview = self.gee_provider.get_rgb_preview_url(roi, year)
                if preview:
                    return preview
            except Exception as e:
                logger.warning(f"GEE preview generation failed for {year}: {e}")

        # Fallback to local provider if GEE preview is unavailable
        return self.local_provider.get_rgb_preview_url(roi, year)

    def get_status(self) -> Dict[str, Any]:
        """
        Returns comprehensive status of both GEE and Local Data Providers.
        """
        gee_status = self.gee_provider.check_availability()
        local_status = self.local_provider.check_availability()

        active_primary = "Google Earth Engine" if (gee_status.is_available and settings.DATA_PROVIDER_MODE != "local") else "Local GeoTIFF Fallback"

        return {
            "active_provider": active_primary,
            "provider_mode": settings.DATA_PROVIDER_MODE,
            "gee_enabled": settings.GEE_ENABLED,
            "gee": gee_status.model_dump(),
            "local_fallback": local_status.model_dump(),
            "provenance": {
                "optical_sensor": "Sentinel-2 MSI (Level-2A Harmonized Surface Reflectance)",
                "thermal_sensor": "Landsat 8/9 TIRS (Collection 2 Level 2 Surface Temperature)",
                "study_area": "Raigad District, Maharashtra, India"
            }
        }

data_provider_manager = DataProviderManager()
