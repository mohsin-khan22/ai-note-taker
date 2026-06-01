import json
from openai import OpenAI, RateLimitError

from config import OPENAI_API_KEY, OPENAI_CHAT_MODEL

SUMMARY_TYPE_GUIDES = {
    "general": "Standard meeting summary covering decisions, discussions, and outcomes.",
    "standup": "Focus on: what each person did, blockers, and plans for today. Keep it brief.",
    "client_call": "Focus on: client needs, commitments made, follow-ups, and relationship notes.",
    "lecture": "Focus on: main concepts taught, definitions, examples, and study takeaways.",
}


class OpenAISummarizer:
    def __init__(self):
        if not OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY is not set")
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    def summarize(
        self,
        transcript: str,
        summary_length: str,
        summary_type: str = "general",
        instructions: str | None = None,
    ):
        length_guide = {
            "short": "2-3 sentences",
            "medium": "1-2 short paragraphs",
            "detailed": "3-4 paragraphs with specifics",
        }.get(summary_length, "1-2 short paragraphs")

        type_guide = SUMMARY_TYPE_GUIDES.get(summary_type, SUMMARY_TYPE_GUIDES["general"])
        extra = f"\nAdditional instructions: {instructions}" if instructions else ""

        prompt = f"""Analyze this meeting transcript and respond with JSON only.

Meeting type: {summary_type}
{type_guide}{extra}

Transcript:
{transcript[:120000]}

Return JSON with this exact structure:
{{
  "summary": "string — {length_guide}",
  "key_points": ["string", ...],
  "action_items": ["string", ...],
  "entities": {{
    "people": ["string", ...],
    "dates": ["string", ...],
    "organizations": ["string", ...],
    "locations": ["string", ...]
  }}
}}

Rules:
- key_points: 3-5 concise bullets
- action_items: tasks/decisions (empty array if none)
- entities: extract from transcript; use empty arrays when none found
"""

        try:
            response = self.client.chat.completions.create(
                model=OPENAI_CHAT_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You summarize meetings. Always respond with valid JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
        except RateLimitError as e:
            raise RuntimeError(
                "OpenAI rate limit exceeded. Please wait a moment and try again."
            ) from e

        content = response.choices[0].message.content
        data = json.loads(content)

        entities = data.get("entities") or {}
        return {
            "summary": data.get("summary", ""),
            "key_points": data.get("key_points", [])[:5],
            "action_items": data.get("action_items", [])[:8],
            "entities": {
                "people": entities.get("people", []),
                "dates": entities.get("dates", []),
                "organizations": entities.get("organizations", []),
                "locations": entities.get("locations", []),
            },
        }
