import whisper
import torch

class Transcriber:
    def __init__(self, model_size="base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model(model_size, device=self.device)

    def transcribe(self, file_path: str, language: str = None):
        """Transcribes audio file to text."""
        result = self.model.transcribe(file_path, language=language)
        return {
            "text": result["text"],
            "language": result.get("language", "unknown")
        }
