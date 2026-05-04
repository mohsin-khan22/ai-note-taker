import os
from pydub import AudioSegment
import tempfile

def convert_to_wav(file_path: str) -> str:
    """Converts uploaded audio file to WAV format for Whisper processing."""
    audio = AudioSegment.from_file(file_path)
    wav_path = file_path.rsplit('.', 1)[0] + ".wav"
    audio.export(wav_path, format="wav")
    return wav_path

def get_audio_duration(file_path: str) -> float:
    """Returns duration of audio file in seconds."""
    audio = AudioSegment.from_file(file_path)
    return len(audio) / 1000.0
