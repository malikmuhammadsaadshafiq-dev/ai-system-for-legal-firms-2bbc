from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from ..database import get_db
from ..models import User, Case
from ..schemas import CaseCreate, CasePatch, CaseOut
from ..auth import get_current_user

router = APIRouter(tags=["cases"])


@router.get("/api/cases", response_model=list[CaseOut])
async def list_cases(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Case).where(Case.firm_id == user.firm_id))
    return result.scalars().all()


@router.post("/api/cases", response_model=CaseOut, status_code=201)
async def create_case(
    body: CaseCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    case = Case(id=str(uuid.uuid4()), firm_id=user.firm_id, **body.model_dump())
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case


@router.get("/api/cases/{id}", response_model=CaseOut)
async def get_case(
    id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Case).where(Case.id == id, Case.firm_id == user.firm_id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
    return case


@router.patch("/api/cases/{id}", response_model=CaseOut)
async def patch_case(
    id: str,
    body: CasePatch,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Case).where(Case.id == id, Case.firm_id == user.firm_id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(case, k, v)
    await db.commit()
    await db.refresh(case)
    return case
