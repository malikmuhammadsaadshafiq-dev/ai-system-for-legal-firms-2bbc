from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from ..database import get_db
from ..models import User, Case, Template, Draft
from ..schemas import DraftGenerateRequest, DraftOut
from ..auth import get_current_user
from ..services.llm import generate_draft

router = APIRouter(tags=["drafts"])


@router.post("/api/drafts/generate", response_model=DraftOut, status_code=201)
async def create_draft(
    body: DraftGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    case_q = await db.execute(
        select(Case).where(Case.id == body.case_id, Case.firm_id == user.firm_id)
    )
    if not case_q.scalar_one_or_none():
        raise HTTPException(404, "Case not found")

    tmpl_q = await db.execute(
        select(Template).where(Template.key == body.template_key)
    )
    template = tmpl_q.scalar_one_or_none()
    template_body = (
        template.body_md if template
        else f"# {body.template_key}\n\n## Facts\n\n{{facts}}"
    )

    content = await generate_draft(template_body, body.facts)
    draft = Draft(
        id=str(uuid.uuid4()),
        case_id=body.case_id,
        template_key=body.template_key,
        content_md=content,
        created_by=user.id,
    )
    db.add(draft)
    await db.commit()
    await db.refresh(draft)
    return draft


@router.get("/api/drafts/{id}", response_model=DraftOut)
async def get_draft(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Draft).join(Case)
        .where(Draft.id == id, Case.firm_id == user.firm_id)
    )
    draft = result.scalar_one_or_none()
    if not draft:
        raise HTTPException(404, "Draft not found")
    return draft
