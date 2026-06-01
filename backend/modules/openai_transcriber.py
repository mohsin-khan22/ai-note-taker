import os
from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_TRANSCRIBE_MODEL

# OpenAI Audio API limit
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
            raise ValueError(
                f"Audio file is too large ({size / (1024 * 1024):.1f} MB). "
                "OpenAI transcription supports files up to 25 MB."
            )

        ext = file_path.rsplit(".", 1)[-1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported audio format '.{ext}' for OpenAI. "
                f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
            )

        with open(file_path, "rb") as audio_file:
            kwargs = {
                "model": OPENAI_TRANSCRIBE_MODEL,
                "file": audio_file,
                "response_format": "verbose_json",
            }
            if language:
                kwargs["language"] = language

            result = self.client.audio.transcriptions.create(**kwargs)

        return {
            "text": result.text,
            "language": getattr(result, "language", None) or "unknown",
        }
