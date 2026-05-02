from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    firm_name: str
    email: str
    password: str
    role: str = "admin"


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: str
    firm_id: str
    email: str
    role: str
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Cases ─────────────────────────────────────────────────────────────────────
class CaseCreate(BaseModel):
    title: str
    client_name: Optional[str] = None
    case_type: Optional[str] = None
    status: str = "open"


class CasePatch(BaseModel):
    title: Optional[str] = None
    client_name: Optional[str] = None
    case_type: Optional[str] = None
    status: Optional[str] = None


class CaseOut(BaseModel):
    id: str
    firm_id: str
    title: str
    client_name: Optional[str] = None
    case_type: Optional[str] = None
    status: str
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Documents ─────────────────────────────────────────────────────────────────
class DocumentOut(BaseModel):
    id: str
    case_id: str
    filename: str
    storage_path: str
    doc_type: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_risks_json: Optional[str] = None
    processed_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


# ── Intake ────────────────────────────────────────────────────────────────────
class IntakeFormCreate(BaseModel):
    slug: str
    fields_json: str = "[]"


class IntakeFormOut(BaseModel):
    id: str
    firm_id: str
    slug: str
    fields_json: str
    model_config = {"from_attributes": True}


class IntakeSubmitRequest(BaseModel):
    payload: dict[str, Any]


# ── Drafts ────────────────────────────────────────────────────────────────────
class DraftGenerateRequest(BaseModel):
    case_id: str
    template_key: str
    facts: str


class DraftOut(BaseModel):
    id: str
    case_id: str
    template_key: Optional[str] = None
    content_md: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}


# ── Templates ─────────────────────────────────────────────────────────────────
class TemplateOut(BaseModel):
    id: str
    key: str
    name: str
    jurisdiction: Optional[str] = None
    body_md: Optional[str] = None
    model_config = {"from_attributes": True}


# ── Billing ───────────────────────────────────────────────────────────────────
class CheckoutRequest(BaseModel):
    plan: str
    success_url: str
    cancel_url: str
