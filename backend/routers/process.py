from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException, BackgroundTasks
import shutil
import os
import asyncio
import uuid

from models.schemas import ProcessResponse
from modules.audio_handler import convert_to_wav, get_audio_duration, _ensure_ffmpeg
from modules.openai_transcriber import SUPPORTED_EXTENSIONS, FileTooLargeError, RateLimitExceededError
from modules.preprocessor import clean_transcript, count_words
from modules.job_store import create_job, update_job
from config import OPENAI_ENABLED

router = APIRouter()


def _run_pipeline(app, job_id: str, temp_file: str, file_ext: str, language, summary_length, summary_type, instructions):
    wav_path = None
    try:
        update_job(job_id, status="transcribing", progress=20, message="Transcribing audio...")

        if OPENAI_ENABLED and file_ext in SUPPORTED_EXTENSIONS:
            audio_path = temp_file
        else:
            wav_path = convert_to_wav(temp_file)
            audio_path = wav_path

        transcriber = app.state.transcriber
        trans_result = transcriber.transcribe(audio_path, language)
        cleaned_text = clean_transcript(trans_result["text"])

        update_job(job_id, status="summarizing", progress=60, message="Generating summary...")

        summarizer = app.state.summarizer
        import inspect
        sig = inspect.signature(summarizer.summarize)
        kwargs = {"transcript": cleaned_text, "summary_length": summary_length}
        if "summary_type" in sig.parameters:
            kwargs["summary_type"] = summary_type
        if "instructions" in sig.parameters:
            kwargs["instructions"] = instructions

        summary_result = summarizer.summarize(**kwargs)

        duration = get_audio_duration(temp_file)
        result = {
            "transcript": cleaned_text,
            "word_count": count_words(cleaned_text),
            "duration_seconds": duration,
            "language_detected": trans_result["language"],
            "segments": trans_result.get("segments", []),
            **summary_result,
        }

        update_job(
            job_id,
            status="completed",
            progress=100,
            message="Done",
            result=result,
        )
    except Exception as e:
        update_job(job_id, status="failed", progress=0, message="Failed", error=str(e))
    finally:
        try:
            if os.path.exists(temp_file):
                os.remove(temp_file)
            if wav_path and os.path.exists(wav_path):
                os.remove(wav_path)
        except Exception:
            pass


@router.post("/process", response_model=ProcessResponse)
async def process_meeting(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    model_size: str = Form("base"),
    language: str = Form(None),
    summary_length: str = Form("medium"),
    summary_type: str = Form("general"),
    instructions: str = Form(None),
):
    _ensure_ffmpeg()
    language = language or None
    instructions = instructions or None

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_ext = (file.filename.split(".")[-1] if file.filename else "bin").lower()
    temp_file = os.path.join(temp_dir, f"{uuid.uuid4()}.{file_ext}")

    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    job_id = create_job()
    background_tasks.add_task(
        _run_pipeline,
        request.app,
        job_id,
        temp_file,
        file_ext,
        language,
        summary_length,
        summary_type,
        instructions,
    )

    return ProcessResponse(job_id=job_id, status="queued")
