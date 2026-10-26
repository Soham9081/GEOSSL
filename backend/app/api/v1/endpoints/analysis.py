from fastapi import APIRouter, HTTPException
from app.models.analysis import AnalysisRequest, AnalysisResult
from app.services.analysis import get_analysis_engine

router = APIRouter()

@router.post("", response_model=AnalysisResult)
async def run_environmental_analysis(request: AnalysisRequest):
    """
    Executes regional environmental change analysis using the active analysis engine.
    In the current prototype phase, this executes PrototypeAnalysisEngine.
    In future phases, the pluggable architecture seamlessly executes GeoSSLMAEAnalysisEngine.
    """
    if request.region_id.lower() != "raigad":
        raise HTTPException(
            status_code=400,
            detail=f"Region '{request.region_id}' is not supported in this prototype. Use 'raigad'."
        )
    
    try:
        engine = get_analysis_engine()
        result = await engine.analyze(request)
        return result
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis processing error: {str(e)}")
