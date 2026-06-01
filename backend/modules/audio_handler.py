import os
import shutil

_FFMPEG_PATH: str | None = None
_FFPROBE_PATH: str | None = None

FFMPEG_SETUP_HINT = (
    "Audio processing requires ffmpeg. "
    "Run `pip install static-ffmpeg` (included in requirements.txt) or install ffmpeg system-wide."
)


def _try_resolve_ffmpeg_paths() -> tuple[str, str] | None:
    """Resolve ffmpeg/ffprobe paths; return None if not found."""
    global _FFMPEG_PATH, _FFPROBE_PATH
    if _FFMPEG_PATH and _FFPROBE_PATH:
        return _FFMPEG_PATH, _FFPROBE_PATH

    ffmpeg = None
    ffprobe = None

    try:
        from static_ffmpeg import add_paths
        from static_ffmpeg.run import get_or_fetch_platform_executables_else_raise

        add_paths()
        ffmpeg, ffprobe = get_or_fetch_platform_executables_else_raise()
        if ffmpeg and os.path.isfile(ffmpeg):
            _FFMPEG_PATH = ffmpeg
            _FFPROBE_PATH = (ffprobe if ffprobe and os.path.isfile(ffprobe) else ffmpeg)
            return _FFMPEG_PATH, _FFPROBE_PATH
    except ImportError:
        pass
    except Exception:
        pass

    venv_ffmpeg = os.path.join(os.getcwd(), "venv", "Scripts", "ffmpeg.exe")
    venv_ffprobe = os.path.join(os.getcwd(), "venv", "Scripts", "ffprobe.exe")
    if not ffmpeg and os.path.exists(venv_ffmpeg):
        ffmpeg = venv_ffmpeg
        ffprobe = venv_ffprobe if os.path.exists(venv_ffprobe) else None

    if not ffmpeg:
        ffmpeg = shutil.which("ffmpeg")
    if not ffprobe:
        ffprobe = shutil.which("ffprobe")

    if ffmpeg:
        _FFMPEG_PATH = ffmpeg
        _FFPROBE_PATH = ffprobe or ffmpeg
        return _FFMPEG_PATH, _FFPROBE_PATH

    return None


_paths = _try_resolve_ffmpeg_paths()

from pydub import AudioSegment
from pydub.exceptions import CouldntDecodeError

if _paths:
    AudioSegment.converter = _paths[0]
    AudioSegment.ffprobe = _paths[1]


def get_ffmpeg_path() -> str | None:
    """Return resolved ffmpeg binary path, or None if unavailable."""
    paths = _try_resolve_ffmpeg_paths()
    return paths[0] if paths else None


def _ensure_ffmpeg() -> None:
    """Raise RuntimeError if ffmpeg is not configured."""
    if not _try_resolve_ffmpeg_paths():
        raise RuntimeError(FFMPEG_SETUP_HINT)


def convert_to_wav(file_path: str) -> str:
    """Converts uploaded audio file to WAV format for Whisper processing."""
    audio = AudioSegment.from_file(file_path)
    wav_path = file_path.rsplit(".", 1)[0] + ".wav"
    audio.export(wav_path, format="wav")
    return wav_path


def get_audio_duration(file_path: str) -> float:
    """Returns duration of audio file in seconds."""
    audio = AudioSegment.from_file(file_path)
    return len(audio) / 1000.0


def is_audio_processing_error(exc: BaseException) -> bool:
    """True if the exception is likely due to missing ffmpeg or bad audio."""
    if isinstance(exc, (RuntimeError, FileNotFoundError, CouldntDecodeError)):
        return True
    if isinstance(exc, OSError) and getattr(exc, "winerror", None) == 2:
        return True
    msg = str(exc).lower()
    return "ffmpeg" in msg or "ffprobe" in msg or "avconv" in msg
