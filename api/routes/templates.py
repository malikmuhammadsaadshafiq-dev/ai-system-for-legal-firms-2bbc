from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import User, Template
from ..schemas import TemplateOut
from ..auth import get_current_user

router = APIRouter(tags=["templates"])


@router.get("/api/templates", response_model=list[TemplateOut])
async def list_templates(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Template))
    return result.scalars().all()
