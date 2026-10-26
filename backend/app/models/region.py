from pydantic import BaseModel

class BoundingBox(BaseModel):
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float

class RegionResponse(BaseModel):
    id: str
    name: str
    state: str
    country: str
    centroid: dict[str, float]
    bbox: BoundingBox
    total_area_sq_km: float
    talukas: list[str]
    supported_years: list[int]
    description: str
