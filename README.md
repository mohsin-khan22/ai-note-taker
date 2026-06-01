# AI-Based Meeting Summarizer

An intelligent system that converts meeting audio into structured summaries, key points, and action items.

## Team
- **Muhammad Haider Khan (B-28543)** — Speech Processing Module
- **Muhammad Mohsin (B-28583)** — NLP & Summarization Module
- **Muhammad Fahad (B-26798)** — UI & System Integration

## Prerequisites
- **Node.js 18+**
- **Python 3.10+**
- **ffmpeg** (Essential for audio processing; bundled via `static-ffmpeg` when you `pip install -r requirements.txt`)
  - Alternatively install system-wide: Windows `choco install ffmpeg`, Mac `brew install ffmpeg`, Linux `sudo apt install ffmpeg`

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # Windows: copy .env.example .env
# Add your OPENAI_API_KEY to .env (uses OpenAI Whisper + GPT when set)
python -m spacy download en_core_web_sm  # only needed for local (non-OpenAI) mode
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, TanStack React Query v5, Zustand, Framer Motion.
- **Backend**: FastAPI, OpenAI Whisper (STT), BART Large CNN (Summarization), spaCy (NER), NLTK.
- **Export**: Python-docx, FPDF2.

## Architecture
- **React Query**: Manages all server state (transcripts, summaries).
- **Zustand**: Manages UI-only state (stepper progress, settings).
- **FastAPI Lifespan**: Loads heavy AI models once at startup.
