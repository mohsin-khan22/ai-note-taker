import spacy
from transformers import pipeline
import torch

class MeetingSummarizer:
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        # Load BART summarizer
        self.summarizer = pipeline(
            "summarization", 
            model="facebook/bart-large-cnn", 
            device=self.device
        )
        # Load spaCy for NER
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

    def summarize(self, transcript: str, summary_length: str):
        """Generates summary, key points, and action items."""
        # Map length to tokens
        length_map = {
            "short": (50, 100),
            "medium": (100, 250),
            "detailed": (250, 500)
        }
        min_len, max_len = length_map.get(summary_length, (100, 250))

        # Chunk transcript if too long (BART limit is ~1024 tokens)
        # For simplicity, we chunk by characters (roughly 4 chars per token)
        max_chunk = 3000 
        chunks = [transcript[i:i + max_chunk] for i in range(0, len(transcript), max_chunk)]
        
        summaries = []
        for chunk in chunks:
            if len(chunk.split()) < 30: continue # Skip tiny chunks
            res = self.summarizer(chunk, max_length=max_len, min_length=min_len, do_sample=False)
            summaries.append(res[0]['summary_text'])
        
        final_summary = " ".join(summaries)
        
        # Extract Key Points (using first few sentences of summary or custom logic)
        doc = self.nlp(final_summary)
        key_points = [sent.text.strip() for sent in doc.sents][:5]

        # Extract Action Items (keywords: "need to", "must", "action", "task", "assign")
        action_items = []
        action_keywords = ["need to", "must", "should", "will", "action item", "task"]
        doc_full = self.nlp(transcript)
        for sent in doc_full.sents:
            if any(kw in sent.text.lower() for kw in action_keywords):
                action_items.append(sent.text.strip())
        
        # Limit action items
        action_items = list(set(action_items))[:8]

        # NER
        entities = {
            "people": list(set([ent.text for ent in doc_full.ents if ent.label_ == "PERSON"])),
            "dates": list(set([ent.text for ent in doc_full.ents if ent.label_ == "DATE"])),
            "organizations": list(set([ent.text for ent in doc_full.ents if ent.label_ == "ORG"])),
            "locations": list(set([ent.text for ent in doc_full.ents if ent.label_ == "GPE"]))
        }

        return {
            "summary": final_summary,
            "key_points": key_points,
            "action_items": action_items,
            "entities": entities
        }
