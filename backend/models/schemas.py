from pydantic import BaseModel
from typing import List, Dict, Optional


class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str


class TranscribeResponse(BaseModel):
    transcript: str
    word_count: int
    duration_seconds: float
    language_detected: str
    segments: List[TranscriptSegment] = []


class SummarizeRequest(BaseModel):
    transcript: str
    summary_length: str = "medium"
    summary_type: str = "general"
    instructions: Optional[str] = None


class EntitiesModel(BaseModel):
    people: List[str] = []
    dates: List[str] = []
    organizations: List[str] = []
    locations: List[str] = []


class SummarizeResponse(BaseModel):
    summary: str
    key_points: List[str]
    action_items: List[str]
    entities: EntitiesModel


class ExportRequest(BaseModel):
    format: str
    title: str
    date: str
    transcript: str
    summary: str
    key_points: List[str]
    action_items: List[str]
    entities: Optional[EntitiesModel] = None


class ProcessResponse(BaseModel):
    job_id: str
    status: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int = 0
    message: str = ""
    result: Optional[dict] = None
    error: Optional[str] = None
