from typing import Optional
from pydantic import BaseModel, Field

class AnalysisRequest(BaseModel):
    region_id: str = "raigad"
    base_year: int = 2019
    target_year: int = 2025
    indicators: list[str] = Field(default_factory=lambda: ["forest", "urban", "heat"])

class IndicatorMetric(BaseModel):
    label: str
    value: str
    numeric_delta: float
    unit: str
    direction: str  # "increase", "decrease", "stable"

class ForestChangeResult(BaseModel):
    title: str = "Forest Change"
    status_badge: str = "Pre-ML Prototype"
    has_imagery: bool = False
    status_text: str = "Awaiting Satellite Imagery"
    message: str = "Quantitative analysis will be available after satellite imagery is added."
    spectral_index: str = "NDVI (Vegetation Index)"
    spectral_formula: str = "(NIR - Red) / (NIR + Red)"
    baseline_year_index: Optional[float] = None
    target_year_index: Optional[float] = None
    index_delta: Optional[float] = None
    index_delta_percent: Optional[float] = None
    estimated_canopy_retention_percent: Optional[float] = None
    key_metrics: list[IndicatorMetric] = Field(default_factory=list)
    interpretation: Optional[str] = None
    hotspot_zones: list[str] = Field(default_factory=list)

class UrbanChangeResult(BaseModel):
    title: str = "Urban Expansion"
    status_badge: str = "Pre-ML Prototype"
    has_imagery: bool = False
    status_text: str = "Awaiting Satellite Imagery"
    message: str = "Quantitative analysis will be available after satellite imagery is added."
    spectral_index: str = "NDBI (Built-up Index)"
    spectral_formula: str = "(SWIR - NIR) / (SWIR + NIR)"
    baseline_year_index: Optional[float] = None
    target_year_index: Optional[float] = None
    index_delta: Optional[float] = None
    index_delta_percent: Optional[float] = None
    estimated_expansion_percent: Optional[float] = None
    key_metrics: list[IndicatorMetric] = Field(default_factory=list)
    interpretation: Optional[str] = None
    high_growth_corridors: list[str] = Field(default_factory=list)

class HeatChangeResult(BaseModel):
    title: str = "Environmental Heat Indicator"
    status_badge: str = "Pre-ML Prototype"
    has_imagery: bool = False
    status_text: str = "Awaiting Satellite Imagery"
    message: str = "Quantitative analysis will be available after satellite imagery is added."
    indicator_type: str = "Environmental Heat Vulnerability Proxy"
    sensor_limitation_statement: str = (
        "Sentinel-2 satellite has no thermal infrared sensor and does not directly measure surface temperature. "
        "This indicator represents environmental heat vulnerability resulting from vegetation loss and built-up heat retention."
    )
    future_thermal_pipeline: str = (
        "Future thermal analysis can integrate suitable thermal satellite data (e.g., Landsat 8/9 TIRS thermal data) for direct temperature measurement."
    )
    baseline_vulnerability_score: Optional[float] = None
    target_vulnerability_score: Optional[float] = None
    vulnerability_delta_percent: Optional[float] = None
    baseline_mean_temperature_c: Optional[float] = None
    target_mean_temperature_c: Optional[float] = None
    temperature_delta_c: Optional[float] = None
    temperature_delta_percent: Optional[float] = None
    data_source: Optional[str] = None
    key_metrics: list[IndicatorMetric] = Field(default_factory=list)
    interpretation: Optional[str] = None
    vulnerable_talukas: list[str] = Field(default_factory=list)

class AnalysisResult(BaseModel):
    analysis_id: str
    region_id: str
    base_year: int
    target_year: int
    is_prototype: bool = True
    has_imagery: bool = False
    status_text: str = "Awaiting Satellite Imagery"
    status_message: str = "Quantitative analysis will be available after satellite imagery is added."
    analysis_engine: str
    provenance_tag: str
    scientific_integrity_notice: str
    future_mae_vit_notice: str = ""
    data_source: Optional[str] = None
    active_provider: Optional[str] = None
    provenance_details: Optional[dict] = None
    forest_change: Optional[ForestChangeResult] = None
    urban_change: Optional[UrbanChangeResult] = None
    heat_change: Optional[HeatChangeResult] = None
    execution_time_ms: float
