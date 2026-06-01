from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import transcribe, summarize, export
from modules.audio_handler import get_ffmpeg_path
from config import OPENAI_ENABLED
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    ffmpeg_path = get_ffmpeg_path()
    if ffmpeg_path:
        print(f"ffmpeg ready: {ffmpeg_path}")
    else:
        print("WARNING: ffmpeg not found — audio duration/conversion may fail")

    if OPENAI_ENABLED:
        from modules.openai_transcriber import OpenAITranscriber
        from modules.openai_summarizer import OpenAISummarizer

        print("Using OpenAI API (transcription + summarization)...")
        app.state.transcriber = OpenAITranscriber()
        app.state.summarizer = OpenAISummarizer()
        app.state.ai_provider = "openai"
    else:
        from modules.transcriber import Transcriber
        from modules.summarizer import MeetingSummarizer

        print("Loading local AI models (Whisper, BART, spaCy)...")
        app.state.transcriber = Transcriber(model_size="base")
        app.state.summarizer = MeetingSummarizer()
        app.state.ai_provider = "local"

    print("Models ready.")
    yield
    del app.state.transcriber
    del app.state.summarizer

app = FastAPI(title="AI Meeting Summarizer API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(transcribe.router, prefix="/api", tags=["transcription"])
app.include_router(summarize.router, prefix="/api", tags=["summarization"])
app.include_router(export.router, prefix="/api", tags=["export"])

@app.get("/health")
async def health_check():
    ffmpeg_path = get_ffmpeg_path()
    provider = getattr(app.state, "ai_provider", "unknown")
    return {
        "status": "ok",
        "models_loaded": hasattr(app.state, "transcriber") and hasattr(app.state, "summarizer"),
        "ai_provider": provider,
        "openai_enabled": provider == "openai",
        "ffmpeg_available": ffmpeg_path is not None,
        "ffmpeg_path": ffmpeg_path,
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
