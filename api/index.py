"""Legal AI Platform — FastAPI entry point (Vercel serverless via api/index.py)."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import auth, cases, documents, intake, drafts, templates, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Legal AI Platform",
    description="AI-powered case management, document analysis, and draft generation for law firms.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(documents.router)
app.include_router(intake.router)
app.include_router(drafts.router)
app.include_router(templates.router)
app.include_router(billing.router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": "legal-ai-backend"}
