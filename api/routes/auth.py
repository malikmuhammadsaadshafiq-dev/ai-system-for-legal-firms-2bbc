from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from ..database import get_db
from ..models import User, Firm
from ..schemas import SignupRequest, LoginRequest, TokenResponse, UserOut
from ..auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter(tags=["auth"])


@router.post("/api/auth/signup", response_model=TokenResponse, status_code=201)
async def signup(body: SignupRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")

    firm = Firm(id=str(uuid.uuid4()), name=body.firm_name)
    db.add(firm)
    await db.flush()

    user = User(
        id=str(uuid.uuid4()),
        firm_id=firm.id,
        email=body.email,
        password_hash=hash_password(body.password),
        role=body.role,
    )
    db.add(user)
    await db.commit()
    return TokenResponse(access_token=create_token(user.id, firm.id))


@router.post("/api/auth/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return TokenResponse(access_token=create_token(user.id, user.firm_id))


@router.get("/api/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return user
