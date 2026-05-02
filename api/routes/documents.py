from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid, asyncio, json
from datetime import datetime
from ..database import get_db, AsyncSessionLocal
from ..models import User, Case, Document
from ..schemas import DocumentOut
from ..auth import get_current_user
from ..services.storage import save_file, read_file_text
from ..services.llm import analyze_document as llm_analyze

router = APIRouter(tags=["documents"])


async def _run_analysis(doc_id: str) -> None:
    """Background task: run AI analysis and persist results."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Document).where(Document.id == doc_id))
        doc = result.scalar_one_or_none()
        if not doc:
            return
        text = read_file_text(doc.storage_path)
        try:
            analysis = await asyncio.wait_for(llm_analyze(text), timeout=300)
        except asyncio.TimeoutError:
            analysis = {"summary": "Analysis timed out", "risks": []}
        doc.ai_summary = analysis.get("summary", "")
        doc.ai_risks_json = json.dumps(analysis.get("risks", []))
        doc.processed_at = datetime.utcnow()
        await db.commit()


@router.post("/api/documents/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    background_tasks: BackgroundTasks,
    case_id: str,
    doc_type: str = "contract",
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    case_q = await db.execute(
        select(Case).where(Case.id == case_id, Case.firm_id == user.firm_id)
    )
    if not case_q.scalar_one_or_none():
        raise HTTPException(404, "Case not found")
    path, filename = await save_file(file, case_id)
    doc = Document(
        id=str(uuid.uuid4()), case_id=case_id,
        filename=filename, storage_path=path, doc_type=doc_type,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    background_tasks.add_task(_run_analysis, doc.id)
    return doc


@router.get("/api/documents/{id}", response_model=DocumentOut)
async def get_document(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document).join(Case)
        .where(Document.id == id, Case.firm_id == user.firm_id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(404, "Document not found")
    return doc


@router.post("/api/documents/{id}/analyze")
async def trigger_analyze(
    id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Document).join(Case)
        .where(Document.id == id, Case.firm_id == user.firm_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Document not found")
    background_tasks.add_task(_run_analysis, id)
    return {"status": "analysis queued", "document_id": id}
