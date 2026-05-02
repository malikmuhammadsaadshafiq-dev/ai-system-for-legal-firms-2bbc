from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid, json
from ..database import get_db
from ..models import User, IntakeForm, IntakeSubmission
from ..schemas import IntakeFormCreate, IntakeFormOut, IntakeSubmitRequest
from ..auth import get_current_user

router = APIRouter(tags=["intake"])


@router.get("/api/intake/forms", response_model=list[IntakeFormOut])
async def list_forms(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(IntakeForm).where(IntakeForm.firm_id == user.firm_id)
    )
    return result.scalars().all()


@router.post("/api/intake/forms", response_model=IntakeFormOut, status_code=201)
async def create_form(
    body: IntakeFormCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(IntakeForm).where(IntakeForm.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Slug already taken")
    form = IntakeForm(id=str(uuid.uuid4()), firm_id=user.firm_id, **body.model_dump())
    db.add(form)
    await db.commit()
    await db.refresh(form)
    return form


@router.post("/api/intake/{slug}/submit", status_code=201)
async def submit_form(
    slug: str,
    body: IntakeSubmitRequest,
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint — no auth required."""
    result = await db.execute(select(IntakeForm).where(IntakeForm.slug == slug))
    form = result.scalar_one_or_none()
    if not form:
        raise HTTPException(404, "Form not found")
    submission = IntakeSubmission(
        id=str(uuid.uuid4()),
        form_id=form.id,
        payload_json=json.dumps(body.payload),
    )
    db.add(submission)
    await db.commit()
    return {"status": "submitted", "submission_id": submission.id}
