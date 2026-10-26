from fastapi import APIRouter
from app.api.v1.endpoints import system, regions, imagery, analysis, reports

api_router = APIRouter()

api_router.include_router(system.router, prefix="/system", tags=["System Status & ML Phase"])
api_router.include_router(regions.router, prefix="/regions", tags=["Study Regions"])
api_router.include_router(imagery.router, prefix="/imagery", tags=["Sentinel-2 Satellite Imagery"])
api_router.include_router(analysis.router, prefix="/analyze", tags=["Environmental Change Analysis"])
api_router.include_router(reports.router, prefix="/reports", tags=["Academic Reports"])
