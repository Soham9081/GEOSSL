from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float

class Centroid(BaseModel):
    lat: float
    lon: float

class RegionROI(BaseModel):
    """
    Standard Geographic Region of Interest.
    Structured to allow future arbitrary ROIs from frontend while defaulting to Raigad District.
    """
    region_id: str = "raigad"
    name: str = "Raigad District"
    state: str = "Maharashtra"
    country: str = "India"
    centroid: Centroid = Field(default_factory=lambda: Centroid(lat=18.5158, lon=73.1822))
    bbox: BoundingBox = Field(default_factory=lambda: BoundingBox(min_lat=17.85, max_lat=19.15, min_lon=72.85, max_lon=73.55))
    granule_bounds: Optional[BoundingBox] = Field(default_factory=lambda: BoundingBox(min_lat=18.8499, max_lat=19.0500, min_lon=72.8999, max_lon=73.2000))

    @property
    def is_default_raigad(self) -> bool:
        """
        Returns True only if the ROI matches the full Raigad district archive coordinates.
        Custom drawn rectangles or smaller ROIs will return False.
        """
        b = self.bbox
        if abs(b.min_lat - 17.85) < 0.05 and abs(b.max_lat - 19.15) < 0.05 and \
           abs(b.min_lon - 72.85) < 0.05 and abs(b.max_lon - 73.55) < 0.05:
            return True
        if abs(b.min_lat - 18.8499) < 0.05 and abs(b.max_lat - 19.0500) < 0.05 and \
           abs(b.min_lon - 72.8999) < 0.05 and abs(b.max_lon - 73.2000) < 0.05:
            return True
        return False

class MultispectralData(BaseModel):
    """
    Standardized Multispectral Data Container for Vegetation (NDVI) and Built-up (NDBI) analysis.
    Decoupled from data origin (Google Earth Engine or Local GeoTIFF).
    """
    source_name: str
    year: int
    sensor: str = "Sentinel-2 MSI"
    collection_id: str = "COPERNICUS/S2_SR_HARMONIZED"
    has_raster: bool = False
    
    # Optional band arrays (B4 Red, B8 NIR, B11 SWIR-1)
    b4_red: Optional[Any] = Field(default=None, exclude=True)
    b8_nir: Optional[Any] = Field(default=None, exclude=True)
    b11_swir: Optional[Any] = Field(default=None, exclude=True)
    
    # Runtime computed statistics
    mean_ndvi: Optional[float] = None
    mean_ndbi: Optional[float] = None
    valid_pixels_count: Optional[int] = None
    cloud_cover_percent: Optional[float] = None
    preview_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        arbitrary_types_allowed = True

class ThermalData(BaseModel):
    """
    Standardized Thermal Data Container for Land Surface Temperature (LST) analysis.
    Uses Landsat Collection 2 Level 2 Surface Temperature product.
    """
    source_name: str
    year: int
    sensor: str = "Landsat 8/9 TIRS"
    collection_id: str = "LANDSAT/LC08/C02/T1_L2"
    has_raster: bool = False
    
    # Optional LST array in Celsius
    lst_celsius_raster: Optional[Any] = Field(default=None, exclude=True)
    
    # Runtime computed temperature statistics in Celsius
    mean_lst_celsius: Optional[float] = None
    min_lst_celsius: Optional[float] = None
    max_lst_celsius: Optional[float] = None
    valid_pixels_count: Optional[int] = None
    scaling_info: str = "USGS Collection 2 Level 2: Kelvin = ST_B10 * 0.00341802 + 149.0; Celsius = Kelvin - 273.15"
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        arbitrary_types_allowed = True

class ProviderStatus(BaseModel):
    provider_id: str
    display_name: str
    is_available: bool
    is_authenticated: bool
    status_message: str
    details: Dict[str, Any] = Field(default_factory=dict)

class BaseDataProvider(ABC):
    """
    Abstract Base Class for GeoSSL Satellite Data Providers.
    Both GEEDataProvider and LocalDataProvider adhere to this interface.
    """
    @property
    @abstractmethod
    def provider_id(self) -> str:
        pass

    @property
    @abstractmethod
    def display_name(self) -> str:
        pass

    @abstractmethod
    def check_availability(self) -> ProviderStatus:
        pass

    @abstractmethod
    def get_multispectral_data(self, roi: RegionROI, year: int) -> Optional[MultispectralData]:
        pass

    @abstractmethod
    def get_thermal_data(self, roi: RegionROI, year: int) -> Optional[ThermalData]:
        pass

    @abstractmethod
    def get_rgb_preview_url(self, roi: RegionROI, year: int) -> Optional[str]:
        pass
