from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for GeoSSL: Self-Supervised Learning on Satellite Imagery for Label-Efficient Regional Climate Change Monitoring (Prototype)",
    version="0.2.0"
)

# CORS Configuration for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for any dropped-in satellite imagery and GEE cache
settings.GEE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
if settings.DATA_IMAGERY_DIR.exists():
    app.mount("/static/imagery", StaticFiles(directory=str(settings.DATA_IMAGERY_DIR)), name="imagery")
if settings.DATA_CACHE_DIR.exists():
    app.mount("/static/cache", StaticFiles(directory=str(settings.DATA_CACHE_DIR)), name="cache")

# Mount API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_TITLE,
        "phase": settings.SYSTEM_PHASE,
        "status": "online",
        "api_docs": "/docs",
        "endpoints": {
            "system_status": f"{settings.API_V1_STR}/system/status",
            "regions": f"{settings.API_V1_STR}/regions",
            "imagery": f"{settings.API_V1_STR}/imagery",
            "analyze": f"{settings.API_V1_STR}/analyze",
            "reports": f"{settings.API_V1_STR}/reports/summary"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
