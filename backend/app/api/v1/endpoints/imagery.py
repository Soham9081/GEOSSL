from fastapi import APIRouter, Query
from typing import Optional
from app.models.imagery import ImageryMetadataResponse
from app.services.imagery_service import imagery_service
from app.services.data_providers.base import RegionROI, BoundingBox, Centroid

router = APIRouter()

@router.get("", response_model=ImageryMetadataResponse)
async def get_imagery_metadata(
    region_id: str = Query("raigad", description="Study region identifier"),
    year: int = Query(2019, description="Acquisition year (e.g. 2019 or 2025)"),
    min_lat: Optional[float] = Query(None),
    max_lat: Optional[float] = Query(None),
    min_lon: Optional[float] = Query(None),
    max_lon: Optional[float] = Query(None),
):
    """
    Returns Sentinel-2 Level-2A imagery metadata and availability.
    If bbox params are provided, uses that ROI instead of the default region config.
    """
    roi = _build_roi(region_id, min_lat, max_lat, min_lon, max_lon)
    return imagery_service.get_imagery_metadata(region_id=region_id, year=year, roi_override=roi)

@router.get("/compare")
async def get_temporal_pair_imagery(
    region_id: str = Query("raigad", description="Study region identifier"),
    base_year: int = Query(2019, description="Baseline year"),
    target_year: int = Query(2025, description="Target year"),
    min_lat: Optional[float] = Query(None),
    max_lat: Optional[float] = Query(None),
    min_lon: Optional[float] = Query(None),
    max_lon: Optional[float] = Query(None),
):
    """
    Returns paired metadata for baseline and target year for side-by-side or swipe viewer.
    If bbox params are provided, uses that ROI instead of the default region config.
    """
    roi = _build_roi(region_id, min_lat, max_lat, min_lon, max_lon)
    base_meta = imagery_service.get_imagery_metadata(region_id=region_id, year=base_year, roi_override=roi)
    target_meta = imagery_service.get_imagery_metadata(region_id=region_id, year=target_year, roi_override=roi)
    return {
        "region_id": region_id,
        "base_year": base_meta,
        "target_year": target_meta
    }


def _build_roi(
    region_id: str,
    min_lat: Optional[float],
    max_lat: Optional[float],
    min_lon: Optional[float],
    max_lon: Optional[float],
) -> Optional[RegionROI]:
    """Build a RegionROI from bbox params if all four are provided; otherwise return None."""
    if min_lat is not None and max_lat is not None and min_lon is not None and max_lon is not None:
        center_lat = round((min_lat + max_lat) / 2, 4)
        center_lon = round((min_lon + max_lon) / 2, 4)
        bbox = BoundingBox(min_lat=min_lat, max_lat=max_lat, min_lon=min_lon, max_lon=max_lon)
        roi_name = "Raigad District" if (
            abs(min_lat - 17.85) < 0.05 and abs(max_lat - 19.15) < 0.05 and
            abs(min_lon - 72.85) < 0.05 and abs(max_lon - 73.55) < 0.05
        ) else "Selected Study Area"
        return RegionROI(
            region_id=region_id,
            name=roi_name,
            centroid=Centroid(lat=center_lat, lon=center_lon),
            bbox=bbox,
            granule_bounds=bbox,
        )
    return None
