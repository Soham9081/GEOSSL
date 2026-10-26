from app.models.analysis import AnalysisRequest, AnalysisResult
from app.services.analysis.base import BaseChangeAnalyzer

class GeoSSLMAEAnalysisEngine(BaseChangeAnalyzer):
    """
    Future GeoSSL Masked Autoencoder (MAE) + Vision Transformer (ViT) Inference Engine.
    
    Architecture Specification:
    - Backbone: Vision Transformer (ViT-Base) with patch size 16x16
    - Input Channels: 12 Sentinel-2 MSI Multi-Spectral Bands
    - Pre-training Scheme: Self-Supervised Masked Autoencoding (MAE)
    - Masking Ratio: 75% random spatial patch masking
    - Fine-Tuning Head: Lightweight linear probing and multi-task segmentation decoder
    - Training Status: Untrained (Phase 2/3 Milestone)
    
    When model training is completed, this engine will load the PyTorch weights
    checkpoint (`geossl_mae_raigad_vit.pth`), run tensor inference on raw Sentinel-2 patches,
    and return the exact same AnalysisResult schema expected by the frontend.
    """

    def __init__(self):
        self.model_checkpoint_path = None
        self.is_trained = False

    async def analyze(self, request: AnalysisRequest) -> AnalysisResult:
        raise NotImplementedError(
            "GeoSSL MAE + ViT model is NOT yet trained. For this prototype, "
            "the system is configured to use 'PrototypeAnalysisEngine'. "
            "Please switch ANALYSIS_ENGINE_TYPE to 'prototype' in core/config.py."
        )
