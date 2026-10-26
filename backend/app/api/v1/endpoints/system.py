from fastapi import APIRouter
from app.core.config import settings
from app.models.system import SystemStatusResponse

router = APIRouter()

@router.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """
    Returns current system health, active development phase,
    model status, and architectural specifications.
    """
    return SystemStatusResponse(
        project_title=settings.PROJECT_TITLE,
        phase=settings.SYSTEM_PHASE,
        model_status=settings.MODEL_STATUS,
        active_engine=f"PrototypeAnalysisEngine ({settings.ANALYSIS_ENGINE_TYPE})",
        study_region="Raigad District, Maharashtra, India",
        target_years=[2018, 2024],
        methodology=[
            "Self-Supervised Learning (SSL)",
            "Masked Autoencoder (MAE)",
            "Vision Transformer (ViT)",
            "Unlabeled Sentinel-2 Multi-Spectral Pretraining",
            "Limited-Label Fine-Tuning"
        ],
        thermal_sensor_notice=(
            "Sentinel-2 has no thermal infrared (TIR) band. Current heat metrics are directly computed "
            "from Landsat 8/9 TIRS thermal data (Band 10)."
        ),
        raw_imagery_configured=(settings.DATA_IMAGERY_DIR.exists())
    )

@router.get("/gee-status")
async def get_gee_status():
    """
    Returns diagnostic connectivity, authentication setup, and provider status
    for Google Earth Engine and Local GeoTIFF fallback.
    """
    from app.services.data_providers import data_provider_manager
    return data_provider_manager.get_status()

