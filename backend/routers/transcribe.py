from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
import shutil
import os
from models.schemas import TranscribeResponse
from modules.audio_handler import convert_to_wav, get_audio_duration
from modules.preprocessor import clean_transcript, count_words
import uuid

router = APIRouter()

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    request: Request,
    file: UploadFile = File(...),
    model_size: str = Form("base"),
    language: str = Form(None)
):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    file_ext = file.filename.split(".")[-1]
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4()}.{file_ext}")
    
    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get duration before conversion
        duration = get_audio_duration(temp_file)
        
        # Convert to wav
        wav_path = convert_to_wav(temp_file)
        
        # Transcribe
        transcriber = request.app.state.transcriber
        result = transcriber.transcribe(wav_path, language=language)
        
        # Clean
        cleaned_text = clean_transcript(result["text"])
        
        return TranscribeResponse(
            transcript=cleaned_text,
            word_count=count_words(cleaned_text),
            duration_seconds=duration,
            language_detected=result["language"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_file): os.remove(temp_file)
        if 'wav_path' in locals() and os.path.exists(wav_path): os.remove(wav_path)
