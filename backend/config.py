import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
USE_OPENAI = os.getenv("USE_OPENAI", "true").lower() in ("1", "true", "yes")
OPENAI_TRANSCRIBE_MODEL = os.getenv("OPENAI_TRANSCRIBE_MODEL", "whisper-1")
OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")

OPENAI_ENABLED = USE_OPENAI and bool(OPENAI_API_KEY)
