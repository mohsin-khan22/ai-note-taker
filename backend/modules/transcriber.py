import whisper
import torch


class Transcriber:
    def __init__(self, model_size="base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model(model_size, device=self.device)

    def transcribe(self, file_path: str, language: str = None):
        result = self.model.transcribe(file_path, language=language)
        segments = [
            {
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"].strip(),
            }
            for seg in result.get("segments", [])
            if seg.get("text", "").strip()
        ]
        return {
            "text": result["text"],
            "language": result.get("language", "unknown"),
            "segments": segments,
        }
