from pydantic import BaseModel

class SystemStatusResponse(BaseModel):
    project_title: str
    phase: str
    model_status: str
    active_engine: str
    study_region: str
    target_years: list[int]
    methodology: list[str]
    thermal_sensor_notice: str
    raw_imagery_configured: bool
