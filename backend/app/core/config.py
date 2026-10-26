import os
from pathlib import Path
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "GeoSSL Prototype API"
    PROJECT_TITLE: str = "GeoSSL: Self-Supervised Learning on Satellite Imagery for Label-Efficient Regional Climate Change Monitoring"
    API_V1_STR: str = "/api/v1"
    
    # Academic Metadata
    SYSTEM_PHASE: str = "Functional Prototype"
    MODEL_STATUS: str = "MAE + ViT Untrained (Pre-training Phase Planned)"
    STUDY_REGION_DEFAULT: str = "raigad"
    DEFAULT_BASE_YEAR: int = 2019
    DEFAULT_TARGET_YEAR: int = 2025
    
    # Pluggable Analysis Engine: 'prototype' (Active) or 'mae_vit' (Future)
    ANALYSIS_ENGINE_TYPE: str = "prototype"
    
    # Data Providers Configuration
    # 'gee': Attempt Google Earth Engine first, fallback to local TIFF
    # 'local': Force local GeoTIFF provider only
    DATA_PROVIDER_MODE: str = os.getenv("GEOSSL_PROVIDER_MODE", "gee").lower()
    GEE_ENABLED: bool = os.getenv("GEE_ENABLED", "true").lower() in ("true", "1", "yes")
    
    # Google Earth Engine credentials & project ID from environment
    EE_PROJECT: Optional[str] = os.getenv("EE_PROJECT") or os.getenv("EARTHENGINE_PROJECT")
    EE_SERVICE_ACCOUNT: Optional[str] = os.getenv("EE_SERVICE_ACCOUNT")
    EE_PRIVATE_KEY_FILE: Optional[str] = os.getenv("EE_PRIVATE_KEY_FILE")
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_IMAGERY_DIR: Path = BASE_DIR / "data" / "imagery"
    DATA_CACHE_DIR: Path = BASE_DIR / "data" / "cache"
    GEE_CACHE_DIR: Path = DATA_CACHE_DIR / "gee"
    
    # Study Region ROI Defaults (Raigad District, Maharashtra, India)
    DEFAULT_REGION_ROI: Dict[str, Any] = Field(default_factory=lambda: {
        "region_id": "raigad",
        "name": "Raigad District",
        "state": "Maharashtra",
        "country": "India",
        "centroid": {"lat": 18.5158, "lon": 73.1822},
        "bbox": {
            "min_lat": 17.85,
            "max_lat": 19.15,
            "min_lon": 72.85,
            "max_lon": 73.55
        },
        "granule_bounds": {
            "min_lat": 18.8499,
            "max_lat": 19.0500,
            "min_lon": 72.8999,
            "max_lon": 73.2000
        }
    })
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()

