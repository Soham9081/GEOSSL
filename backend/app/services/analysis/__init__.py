from app.core.config import settings
from app.services.analysis.base import BaseChangeAnalyzer
from app.services.analysis.prototype_engine import PrototypeAnalysisEngine
from app.services.analysis.maevit_engine import GeoSSLMAEAnalysisEngine

def get_analysis_engine() -> BaseChangeAnalyzer:
    if settings.ANALYSIS_ENGINE_TYPE == "mae_vit":
        return GeoSSLMAEAnalysisEngine()
    return PrototypeAnalysisEngine()
