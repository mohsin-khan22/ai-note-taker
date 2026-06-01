import spacy
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

class MeetingSummarizer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        model_name = "facebook/bart-large-cnn"
        
        print(f"Loading summarization model: {model_name}...")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(self.device)
        
        # Load spaCy for NER
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

    def summarize(self, transcript: str, summary_length: str):
        """Generates summary, key points, and action items."""
        length_map = {
            "short": (50, 100),
            "medium": (100, 250),
            "detailed": (250, 500)
        }
        min_len, max_len = length_map.get(summary_length, (100, 250))

        # Chunking logic
        max_chunk = 3000 
        chunks = [transcript[i:i + max_chunk] for i in range(0, len(transcript), max_chunk)]
        
        summaries = []
        for chunk in chunks:
            if len(chunk.split()) < 30: continue
            
            inputs = self.tokenizer([chunk], max_length=1024, return_tensors="pt", truncation=True).to(self.device)
            summary_ids = self.model.generate(
                inputs["input_ids"], 
                num_beams=4, 
                min_length=min_len, 
                max_length=max_len, 
                early_stopping=True
            )
            summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            summaries.append(summary)
        
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
