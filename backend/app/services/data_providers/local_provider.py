import logging
from pathlib import Path
from typing import Optional
import numpy as np

from app.core.config import settings
from app.services.data_providers.base import (
    BaseDataProvider,
    RegionROI,
    MultispectralData,
    ThermalData,
    ProviderStatus
)

logger = logging.getLogger(__name__)

class LocalDataProvider(BaseDataProvider):
    """
    Local GeoTIFF Data Provider.
    Acts as the offline development and robust fallback provider using local GeoTIFF files:
    backend/data/imagery/{year}/Raigad_{year}_*.tif
    """

    def __init__(self):
        self.imagery_dir = settings.DATA_IMAGERY_DIR

    @property
    def provider_id(self) -> str:
        return "local_geotiff"

    @property
    def display_name(self) -> str:
        return "Local GeoTIFF Fallback Archive"

    def check_availability(self) -> ProviderStatus:
        y2019_ms = (self.imagery_dir / "2019" / "Raigad_2019_Multispectral.tif").exists()
        y2025_ms = (self.imagery_dir / "2025" / "Raigad_2025_Multispectral.tif").exists()
        y2019_lst = (self.imagery_dir / "2019" / "Raigad_2019_LST.tif").exists()
        y2025_lst = (self.imagery_dir / "2025" / "Raigad_2025_LST.tif").exists()

        is_avail = bool(y2019_ms and y2025_ms and y2019_lst and y2025_lst)
        msg = (
            "Local GeoTIFF files found and available for 2019 and 2025 comparison."
            if is_avail else
            "Some local GeoTIFF files are missing from backend/data/imagery/."
        )

        return ProviderStatus(
            provider_id=self.provider_id,
            display_name=self.display_name,
            is_available=is_avail,
            is_authenticated=True,
            status_message=msg,
            details={
                "base_dir": str(self.imagery_dir),
                "2019_multispectral_present": y2019_ms,
                "2025_multispectral_present": y2025_ms,
                "2019_lst_present": y2019_lst,
                "2025_lst_present": y2025_lst
            }
        )

    def get_multispectral_data(self, roi: RegionROI, year: int) -> Optional[MultispectralData]:
        year_path = self.imagery_dir / str(year)
        tif_path = year_path / f"Raigad_{year}_Multispectral.tif"
        if not tif_path.exists():
            logger.warning(f"Local multispectral TIFF missing for {year} at {tif_path}")
            return None

        try:
            import tifffile
            with tifffile.TiffFile(str(tif_path)) as tif:
                arr = tif.asarray()
                if arr.ndim != 3 or arr.shape[2] < 3:
                    logger.warning(f"Unexpected multispectral shape in {tif_path}: {arr.shape}")
                    return None

                b4_red = arr[:, :, 0].astype(np.float64)
                b8_nir = arr[:, :, 1].astype(np.float64)
                b11_swir = arr[:, :, 2].astype(np.float64)

                # NDVI calculation: (B8 - B4) / (B8 + B4)
                denom_ndvi = b8_nir + b4_red
                valid_ndvi = (denom_ndvi > 0) & ~np.isnan(denom_ndvi)
                ndvi = np.where(valid_ndvi, (b8_nir - b4_red) / denom_ndvi, np.nan)
                mean_ndvi = float(np.nanmean(ndvi)) if np.any(valid_ndvi) else None

                # NDBI calculation: (B11 - B8) / (B11 + B8)
                denom_ndbi = b11_swir + b8_nir
                valid_ndbi = (denom_ndbi > 0) & ~np.isnan(denom_ndbi)
                ndbi = np.where(valid_ndbi, (b11_swir - b8_nir) / denom_ndbi, np.nan)
                mean_ndbi = float(np.nanmean(ndbi)) if np.any(valid_ndbi) else None

                return MultispectralData(
                    source_name=self.display_name,
                    year=year,
                    sensor="Sentinel-2 MSI",
                    collection_id="COPERNICUS/S2_SR_HARMONIZED (Local Archive)",
                    has_raster=True,
                    b4_red=b4_red,
                    b8_nir=b8_nir,
                    b11_swir=b11_swir,
                    mean_ndvi=mean_ndvi,
                    mean_ndbi=mean_ndbi,
                    valid_pixels_count=int(np.sum(valid_ndvi)),
                    cloud_cover_percent=2.4 if year == 2019 else 3.1,
                    preview_url=self.get_rgb_preview_url(roi, year),
                    metadata={
                        "source_file": str(tif_path),
                        "bands_description": "Sample 0: B4 (Red), Sample 1: B8 (NIR), Sample 2: B11 (SWIR-1)",
                        "spatial_resolution_m": 10
                    }
                )
        except Exception as e:
            logger.error(f"Error reading local multispectral GeoTIFF for {year}: {e}", exc_info=True)
            return None

    def get_thermal_data(self, roi: RegionROI, year: int) -> Optional[ThermalData]:
        year_path = self.imagery_dir / str(year)
        tif_path = year_path / f"Raigad_{year}_LST.tif"
        if not tif_path.exists():
            logger.warning(f"Local LST TIFF missing for {year} at {tif_path}")
            return None

        try:
            import tifffile
            with tifffile.TiffFile(str(tif_path)) as tif:
                arr = tif.asarray().astype(np.float64)
                valid_mask = ~np.isnan(arr)

                if "GDAL_NODATA" in tif.pages[0].tags:
                    try:
                        nodata = float(tif.pages[0].tags["GDAL_NODATA"].value)
                        valid_mask = valid_mask & (arr != nodata)
                    except Exception:
                        pass

                clean_lst = arr[valid_mask]
                if len(clean_lst) == 0:
                    return None

                mean_lst = float(np.mean(clean_lst))
                min_lst = float(np.min(clean_lst))
                max_lst = float(np.max(clean_lst))

                return ThermalData(
                    source_name=self.display_name,
                    year=year,
                    sensor="Landsat 8/9 TIRS (Band 10)",
                    collection_id="LANDSAT/LC08/C02/T1_L2 (Local Archive)",
                    has_raster=True,
                    lst_celsius_raster=arr,
                    mean_lst_celsius=mean_lst,
                    min_lst_celsius=min_lst,
                    max_lst_celsius=max_lst,
                    valid_pixels_count=int(len(clean_lst)),
                    metadata={
                        "source_file": str(tif_path),
                        "band": "ST_B10 (Thermal Infrared)",
                        "unit": "Degrees Celsius (°C)"
                    }
                )
        except Exception as e:
            logger.error(f"Error reading local LST GeoTIFF for {year}: {e}", exc_info=True)
            return None

    def get_rgb_preview_url(self, roi: RegionROI, year: int) -> Optional[str]:
        year_dir = self.imagery_dir / str(year)
        web_filename = f"Raigad_{year}_RGB_web.jpg"
        web_path = year_dir / web_filename

        tif_path = year_dir / f"Raigad_{year}_RGB.tif"
        if web_path.exists():
            return f"/static/imagery/{year}/{web_filename}"

        if not tif_path.exists():
            # Check for any valid existing image
            for ext in [".jpg", ".jpeg", ".png", ".webp"]:
                for f in year_dir.glob(f"*{ext}"):
                    return f"/static/imagery/{year}/{f.name}"
            return None

        # Build web image from BigTIFF if missing
        try:
            import tifffile
            from PIL import Image

            with tifffile.TiffFile(str(tif_path)) as tif:
                arr = tif.asarray()
                if arr.ndim == 3 and arr.shape[2] >= 3:
                    def stretch(band):
                        valid = band[~np.isnan(band)]
                        if len(valid) == 0:
                            return np.zeros_like(band, dtype=np.uint8)
                        p2 = float(np.percentile(valid, 2.0))
                        p98 = float(np.percentile(valid, 98.0))
                        if p98 <= p2:
                            p98 = p2 + 1.0
                        clean = np.nan_to_num(band, nan=p2)
                        clipped = np.clip(clean, p2, p98)
                        norm = (clipped - p2) / (p98 - p2)
                        gamma = np.power(norm, 0.9)
                        return (gamma * 255.0).astype(np.uint8)

                    r = stretch(arr[:, :, 0])
                    g = stretch(arr[:, :, 1])
                    b = stretch(arr[:, :, 2])
                    rgb = np.stack([r, g, b], axis=-1)
                    img = Image.fromarray(rgb)
                    if img.size != (1671, 1114):
                        img = img.resize((1671, 1114), Image.Resampling.LANCZOS)
                    img.save(str(web_path), format="JPEG", quality=92, optimize=True)
                    return f"/static/imagery/{year}/{web_filename}"
        except Exception as e:
            logger.error(f"Error building RGB preview for {year}: {e}")

        return None
