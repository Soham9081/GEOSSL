from fastapi import APIRouter, Query
from app.api.v1.endpoints.regions import RAIGAD_METADATA
from app.models.analysis import AnalysisRequest
from app.models.report import AcademicReportSummary
from app.services.analysis import get_analysis_engine
from app.services.report_service import report_service

router = APIRouter()

@router.get("/summary", response_model=AcademicReportSummary)
async def get_academic_summary_report(
    region_id: str = Query("raigad", description="Study region ID"),
    base_year: int = Query(2019, description="Baseline year"),
    target_year: int = Query(2025, description="Target year")
):
    """
    Generates structured academic project review report ready for UI rendering and printing.
    """
    request = AnalysisRequest(
        region_id=region_id,
        base_year=base_year,
        target_year=target_year,
        indicators=["forest", "urban", "heat"]
    )
    engine = get_analysis_engine()
    analysis_result = await engine.analyze(request)
    
    return report_service.generate_academic_summary(
        region_info=RAIGAD_METADATA,
        analysis_result=analysis_result
    )
