from fastapi import APIRouter, Request, HTTPException
import asyncio
from models.schemas import SummarizeRequest, SummarizeResponse

router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_transcript(request: Request, body: SummarizeRequest):
    try:
        summarizer = request.app.state.summarizer
        kwargs = {
            "transcript": body.transcript,
            "summary_length": body.summary_length,
        }
        if hasattr(summarizer, "summarize"):
            import inspect
            sig = inspect.signature(summarizer.summarize)
            if "summary_type" in sig.parameters:
                kwargs["summary_type"] = body.summary_type
            if "instructions" in sig.parameters:
                kwargs["instructions"] = body.instructions

        result = await asyncio.to_thread(summarizer.summarize, **kwargs)
        return SummarizeResponse(**result)
    except RuntimeError as e:
        if "rate limit" in str(e).lower():
            raise HTTPException(status_code=429, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
