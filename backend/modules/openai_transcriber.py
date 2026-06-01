import os
from openai import OpenAI, APIError, RateLimitError

from config import OPENAI_API_KEY, OPENAI_TRANSCRIBE_MODEL

MAX_FILE_BYTES = 25 * 1024 * 1024

SUPPORTED_EXTENSIONS = {
    "flac", "m4a", "mp3", "mp4", "mpeg", "mpga", "oga", "ogg", "wav", "webm"
}


class OpenAITranscriber:
    def __init__(self):
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set")
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    def transcribe(self, file_path: str, language: str | None = None):
        size = os.path.getsize(file_path)
        if size > MAX_FILE_BYTES:
            raise FileTooLargeError(
                f"Audio file is too large ({size / (1024 * 1024):.1f} MB). "
                "OpenAI transcription supports files up to 25 MB."
            )

        ext = file_path.rsplit(".", 1)[-1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported audio format '.{ext}' for OpenAI. "
                f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
            )

        try:
            with open(file_path, "rb") as audio_file:
                kwargs = {
                    "model": OPENAI_TRANSCRIBE_MODEL,
                    "file": audio_file,
                    "response_format": "verbose_json",
                }
                if language:
                    kwargs["language"] = language

                result = self.client.audio.transcriptions.create(**kwargs)
        except RateLimitError as e:
            raise RateLimitExceededError(
                "OpenAI rate limit exceeded. Please wait a moment and try again."
            ) from e
        except APIError as e:
            if getattr(e, "status_code", None) == 413:
                raise FileTooLargeError("Audio file exceeds OpenAI size limit (25 MB).") from e
            raise

        segments = []
        raw_segments = getattr(result, "segments", None) or []
        for seg in raw_segments:
            segments.append({
                "start": getattr(seg, "start", 0) or 0,
                "end": getattr(seg, "end", 0) or 0,
                "text": getattr(seg, "text", "") or "",
            })

        return {
            "text": result.text,
            "language": getattr(result, "language", None) or "unknown",
            "segments": segments,
        }


class FileTooLargeError(ValueError):
    """Raised when audio exceeds upload limits."""


class RateLimitExceededError(RuntimeError):
    """Raised when OpenAI rate limit is hit."""
