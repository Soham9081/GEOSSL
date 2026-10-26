from fastapi import APIRouter, HTTPException
from app.models.region import RegionResponse, BoundingBox

router = APIRouter()

RAIGAD_METADATA = RegionResponse(
    id="raigad",
    name="Raigad District",
    state="Maharashtra",
    country="India",
    centroid={"lat": 18.5158, "lon": 73.1822},
    bbox=BoundingBox(
        min_lat=17.85,
        max_lat=19.15,
        min_lon=72.85,
        max_lon=73.55
    ),
    total_area_sq_km=7152.0,
    talukas=[
        "Alibag", "Panvel", "Roha", "Mahad", "Mangaon",
        "Pen", "Karjat", "Khalapur", "Murud", "Shrivardhan",
        "Poladpur", "Tala", "Uran", "Sudhagad (Pali)", "Mhasla"
    ],
    supported_years=[2019, 2025],
    description=(
        "Coastal district in the Konkan division of Maharashtra, bordered by Mumbai Harbour, "
        "Thane, Pune, and Ratnagiri. Exhibits rapid peri-urban growth in the north (Panvel/Uran) "
        "contrasted with ecologically sensitive Western Ghats forest zones in the east and south."
    )
)

@router.get("", response_model=list[RegionResponse])
async def list_supported_regions():
    """Returns list of supported study regions."""
    return [RAIGAD_METADATA]

@router.get("/{region_id}", response_model=RegionResponse)
async def get_region_details(region_id: str):
    """Returns detailed geographic and administrative metadata for a region."""
    if region_id.lower() == "raigad":
        return RAIGAD_METADATA
    raise HTTPException(status_code=404, detail=f"Region '{region_id}' not found. Current prototype supports 'raigad'.")
