from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
import shutil
import os
import asyncio
from models.schemas import TranscribeResponse
from modules.audio_handler import (
    convert_to_wav,
    get_audio_duration,
    _ensure_ffmpeg,
    is_audio_processing_error,
    FFMPEG_SETUP_HINT,
)
from modules.openai_transcriber import SUPPORTED_EXTENSIONS
from modules.preprocessor import clean_transcript, count_words
from config import OPENAI_ENABLED
import uuid

router = APIRouter()

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    request: Request,
    file: UploadFile = File(...),
    model_size: str = Form("base"),
    language: str = Form(None)
):
    _ensure_ffmpeg()
    language = language or None

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_ext = (file.filename.split(".")[-1] if file.filename else "bin").lower()
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4()}.{file_ext}")
    wav_path = None
    
    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        duration = await asyncio.to_thread(get_audio_duration, temp_file)

        if OPENAI_ENABLED and file_ext in SUPPORTED_EXTENSIONS:
            audio_path = temp_file
        else:
            wav_path = await asyncio.to_thread(convert_to_wav, temp_file)
            audio_path = wav_path
        
        transcriber = request.app.state.transcriber
        result = await asyncio.to_thread(transcriber.transcribe, audio_path, language)
        
        cleaned_text = clean_transcript(result["text"])
        
        return TranscribeResponse(
            transcript=cleaned_text,
            word_count=count_words(cleaned_text),
            duration_seconds=duration,
            language_detected=result["language"]
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        if is_audio_processing_error(e):
            detail = str(e) or FFMPEG_SETUP_HINT
            raise HTTPException(status_code=400, detail=detail)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            if os.path.exists(temp_file):
                os.remove(temp_file)
            if wav_path and os.path.exists(wav_path):
                os.remove(wav_path)
        except Exception as cleanup_error:
            print(f"Cleanup error (likely file still in use): {cleanup_error}")
