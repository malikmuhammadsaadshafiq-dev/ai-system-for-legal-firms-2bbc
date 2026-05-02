"""File storage helpers — saves uploads to /tmp/legal_uploads/{case_id}/."""
import os
from pathlib import Path
from fastapi import UploadFile

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/legal_uploads")


def _ensure(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


async def save_file(file: UploadFile, case_id: str) -> tuple[str, str]:
    """Persist an uploaded file; return (storage_path, safe_filename)."""
    dest_dir = Path(UPLOAD_DIR) / case_id
    _ensure(dest_dir)
    safe_name = Path(file.filename or "upload").name
    dest = dest_dir / safe_name
    content = await file.read()
    dest.write_bytes(content)
    return str(dest), safe_name


def read_file_text(storage_path: str) -> str:
    """Return text content of a stored file (best-effort UTF-8 decode)."""
    try:
        return Path(storage_path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return "[Binary or unreadable file — cannot extract text]"
