from typing import Optional
from pydantic import BaseModel

class SensorBand(BaseModel):
    band_id: str
    common_name: str
    wavelength_nm: int
    resolution_m: int
    description: str

class ImageryMetadataResponse(BaseModel):
    region_id: str
    year: int
    satellite: str
    sensor: str
    processing_level: str
    cloud_cover_percent: float
    ground_resolution_m: int
    available_bands: list[SensorBand]
    has_raw_imagery: bool
    image_url: Optional[str] = None
    imagery_source_hint: str
    thermal_capability: str
    data_source: Optional[str] = None
    provider_status: Optional[dict] = None
    placeholder_info: Optional[dict] = None
