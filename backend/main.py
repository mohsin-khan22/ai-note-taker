from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import transcribe, summarize, export
from modules.transcriber import Transcriber
from modules.summarizer import MeetingSummarizer
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load models at startup
    print("Loading AI models (Whisper, BART, spaCy)...")
    app.state.transcriber = Transcriber(model_size="base")
    app.state.summarizer = MeetingSummarizer()
    print("Models loaded successfully.")
    yield
    # Cleanup if needed
    del app.state.transcriber
    del app.state.summarizer

app = FastAPI(title="AI Meeting Summarizer API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(transcribe.router, prefix="/api", tags=["transcription"])
app.include_router(summarize.router, prefix="/api", tags=["summarization"])
app.include_router(export.router, prefix="/api", tags=["export"])

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "models_loaded": hasattr(app.state, "transcriber") and hasattr(app.state, "summarizer")
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
