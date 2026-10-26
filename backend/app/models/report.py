from pydantic import BaseModel
from app.models.analysis import AnalysisResult
from app.models.region import RegionResponse

class AcademicReportSummary(BaseModel):
    report_title: str
    academic_phase: str
    project_title: str
    institution_context: str
    generated_at: str
    region_metadata: RegionResponse
    temporal_comparison: dict[str, int]
    satellite_specs: dict[str, str]
    analysis_findings: AnalysisResult
    methodology_distinction: dict[str, str]
    future_work_summary: list[str]
