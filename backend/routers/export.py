from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import ExportRequest
from modules.exporter import MeetingExporter

router = APIRouter()


@router.post("/export")
async def export_meeting(body: ExportRequest):
    try:
        data = body.model_dump() if hasattr(body, "model_dump") else body.dict()
        entities = data.get("entities")
        if entities is None:
            data["entities"] = {}
        elif hasattr(entities, "model_dump"):
            data["entities"] = entities.model_dump()
        elif hasattr(entities, "dict"):
            data["entities"] = entities.dict()

        fmt = body.format.lower()

        if fmt == "txt":
            file_obj = MeetingExporter.to_txt(data)
            media_type = "text/plain"
            filename = f"{body.title}.txt"
        elif fmt == "docx":
            file_obj = MeetingExporter.to_docx(data)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename = f"{body.title}.docx"
        elif fmt == "pdf":
            file_obj = MeetingExporter.to_pdf(data)
            media_type = "application/pdf"
            filename = f"{body.title}.pdf"
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")

        return StreamingResponse(
            file_obj,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
