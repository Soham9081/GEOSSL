from abc import ABC, abstractmethod
from app.models.analysis import AnalysisRequest, AnalysisResult

class BaseChangeAnalyzer(ABC):
    """
    Abstract Base Class for GeoSSL Change Detection Engines.
    Both the current PrototypeAnalysisEngine and the future GeoSSLMAEAnalysisEngine
    implement this contract, allowing zero-code-change replacement on the frontend.
    """
    
    @abstractmethod
    async def analyze(self, request: AnalysisRequest) -> AnalysisResult:
        """
        Executes change detection between base_year and target_year
        for the specified study region and returns standardized environmental indicators.
        """
        pass
