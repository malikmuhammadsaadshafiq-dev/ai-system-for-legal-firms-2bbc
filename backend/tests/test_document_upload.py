import pytest
from io import BytesIO
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import DocumentModel, DocumentStatus


@pytest.fixture
async def user_token(client: AsyncClient, db: AsyncSession):
    """Create user and return JWT."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "uploader@firm.com",
            "password": "SecurePass123!",
            "name": "Doc Uploader",
            "firm_id": "firm-123",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
async def case_id(client: AsyncClient, user_token: str, db: AsyncSession):
    """Create a case for document upload."""
    response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "title": "Test Case",
            "client_name": "Test Client",
            "description": "A test case",
        },
    )
    return response.json()["id"]


@pytest.mark.asyncio
async def test_document_upload_stores_file(
    client: AsyncClient, user_token: str, case_id: str, db: AsyncSession
):
    """Test document upload stores file and creates DB row."""
    pdf_content = b"%PDF-1.4\n%fake pdf content"
    
    response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {user_token}"},
        files={"file": ("test.pdf", BytesIO(pdf_content), "application/pdf")},
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["filename"] == "test.pdf"
    assert data["status"] == "pending"
    
    # Verify DB row was created
    result = await db.execute(
        select(DocumentModel).where(DocumentModel.id == data["id"])
    )
    doc = result.scalar_one()
    assert doc is not None
    assert doc.filename == "test.pdf"
    assert doc.status == DocumentStatus.PENDING
    assert doc.case_id == case_id


@pytest.mark.asyncio
async def test_document_upload_creates_pending_status(
    client: AsyncClient, user_token: str, case_id: str, db: AsyncSession
):
    """Test document upload creates row with status=pending."""
    response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {user_token}"},
        files={"file": ("contract.docx", BytesIO(b"fake docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    assert response.status_code == 201
    assert response.json()["status"] == "pending"


@pytest.mark.asyncio
async def test_document_upload_requires_auth(client: AsyncClient, case_id: str):
    """Test document upload requires authentication."""
    response = await client.post(
        f"/api/cases/{case_id}/documents",
        files={"file": ("test.pdf", BytesIO(b"fake"), "application/pdf")},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_document_upload_firm_scoping(
    client: AsyncClient, db: AsyncSession
):
    """Test user cannot upload documents to another firm's cases."""
    # Create user A
    response_a = await client.post(
        "/api/auth/signup",
        json={
            "email": "usera@firma.com",
            "password": "SecurePass123!",
            "name": "User A",
            "firm_id": "firm-a",
        },
    )
    token_a = response_a.json()["access_token"]
    
    # Create user B
    response_b = await client.post(
        "/api/auth/signup",
        json={
            "email": "userb@firmb.com",
            "password": "SecurePass123!",
            "name": "User B",
            "firm_id": "firm-b",
        },
    )
    token_b = response_b.json()["access_token"]
    
    # User B creates case
    case_response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {token_b}"},
        json={"title": "Case B", "client_name": "Client B", "description": ""},
    )
    case_id = case_response.json()["id"]
    
    # User A tries to upload document to user B's case
    response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {token_a}"},
        files={"file": ("hack.pdf", BytesIO(b"hack"), "application/pdf")},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_document_upload_missing_file(
    client: AsyncClient, user_token: str, case_id: str
):
    """Test document upload rejects missing file."""
    response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 400
