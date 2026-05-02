from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from .database import Base


def _id() -> str:
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    admin = "admin"
    lawyer = "lawyer"
    paralegal = "paralegal"


class Firm(Base):
    __tablename__ = "firms"
    id = Column(String, primary_key=True, default=_id)
    name = Column(String, nullable=False)
    plan = Column(String, default="free")
    stripe_customer_id = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    users = relationship("User", back_populates="firm")
    cases = relationship("Case", back_populates="firm")


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=_id)
    firm_id = Column(String, ForeignKey("firms.id"), nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.lawyer)
    created_at = Column(DateTime, default=datetime.utcnow)
    firm = relationship("Firm", back_populates="users")


class Case(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True, default=_id)
    firm_id = Column(String, ForeignKey("firms.id"), nullable=False)
    title = Column(String, nullable=False)
    client_name = Column(String)
    case_type = Column(String)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    firm = relationship("Firm", back_populates="cases")
    documents = relationship("Document", back_populates="case")
    drafts = relationship("Draft", back_populates="case")


class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=_id)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    filename = Column(String, nullable=False)
    storage_path = Column(String, nullable=False)
    doc_type = Column(String)
    ai_summary = Column(Text)
    ai_risks_json = Column(Text)
    processed_at = Column(DateTime)
    case = relationship("Case", back_populates="documents")


class IntakeForm(Base):
    __tablename__ = "intake_forms"
    id = Column(String, primary_key=True, default=_id)
    firm_id = Column(String, ForeignKey("firms.id"), nullable=False)
    slug = Column(String, unique=True, nullable=False)
    fields_json = Column(Text, nullable=False, default="[]")
    submissions = relationship("IntakeSubmission", back_populates="form")


class IntakeSubmission(Base):
    __tablename__ = "intake_submissions"
    id = Column(String, primary_key=True, default=_id)
    form_id = Column(String, ForeignKey("intake_forms.id"), nullable=False)
    payload_json = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    form = relationship("IntakeForm", back_populates="submissions")


class Draft(Base):
    __tablename__ = "drafts"
    id = Column(String, primary_key=True, default=_id)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    template_key = Column(String)
    content_md = Column(Text)
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="drafts")


class Template(Base):
    __tablename__ = "templates"
    id = Column(String, primary_key=True, default=_id)
    key = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    jurisdiction = Column(String)
    body_md = Column(Text)
