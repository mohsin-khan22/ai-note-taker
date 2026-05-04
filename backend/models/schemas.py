from pydantic import BaseModel
from typing import List, Dict, Optional

class TranscribeResponse(BaseModel):
    transcript: str
    word_count: int
    duration_seconds: float
    language_detected: str

class SummarizeRequest(BaseModel):
    transcript: str
    summary_length: str  # short, medium, detailed

class EntitiesModel(BaseModel):
    people: List[str]
    dates: List[str]
    organizations: List[str]
    locations: List[str]

class SummarizeResponse(BaseModel):
    summary: str
    key_points: List[str]
    action_items: List[str]
    entities: EntitiesModel

class ExportRequest(BaseModel):
    format: str  # txt, docx, pdf
    title: str
    date: str
    transcript: str
    summary: str
    key_points: List[str]
    action_items: List[str]
