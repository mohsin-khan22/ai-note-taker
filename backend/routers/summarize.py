from fastapi import APIRouter, Request, HTTPException
from models.schemas import SummarizeRequest, SummarizeResponse

router = APIRouter()

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_transcript(request: Request, body: SummarizeRequest):
    try:
        summarizer = request.app.state.summarizer
        result = summarizer.summarize(body.transcript, body.summary_length)
        return SummarizeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
