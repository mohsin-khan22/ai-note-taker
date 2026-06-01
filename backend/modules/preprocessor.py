import re
import nltk
from nltk.tokenize import sent_tokenize

# Download necessary NLTK data
for _resource in ("punkt", "punkt_tab"):
    try:
        nltk.data.find(f"tokenizers/{_resource}")
    except LookupError:
        nltk.download(_resource)

def clean_transcript(text: str) -> str:
    """Cleans and formats the raw transcript text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Basic sentence casing and punctuation correction
    sentences = sent_tokenize(text)
    cleaned_sentences = [s.capitalize() for s in sentences]
    return " ".join(cleaned_sentences)

def count_words(text: str) -> int:
    """Returns the word count of the text."""
    return len(text.split())
