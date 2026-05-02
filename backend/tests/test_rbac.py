import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import UserRole


@pytest.fixture
async def paralegal_token(client: AsyncClient, db: AsyncSession):
    """Create a paralegal user."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "paralegal@firm.com",
            "password": "SecurePass123!",
            "name": "Jane Paralegal",
            "firm_id": "firm-123",
            "role": "paralegal",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
async def lawyer_token(client: AsyncClient, db: AsyncSession):
    """Create a lawyer user."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "lawyer@firm.com",
            "password": "SecurePass123!",
            "name": "John Lawyer",
            "firm_id": "firm-123",
            "role": "lawyer",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
async def case_created_by_lawyer(
    client: AsyncClient, lawyer_token: str, db: AsyncSession
):
    """Create a case created by lawyer."""
    response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {lawyer_token}"},
        json={
            "title": "Important Case",
            "client_name": "VIP Client",
            "description": "A high-value case",
        },
    )
    return response.json()["id"]


@pytest.mark.asyncio
async def test_paralegal_can_view_cases(
    client: AsyncClient, paralegal_token: str, lawyer_token: str, db: AsyncSession
):
    """Test paralegal can view cases."""
    # Create case as lawyer
    case_response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {lawyer_token}"},
        json={"title": "Test Case", "client_name": "Client", "description": ""},
    )
    case_id = case_response.json()["id"]
    
    # Paralegal views case
    response = await client.get(
        f"/api/cases/{case_id}",
        headers={"Authorization": f"Bearer {paralegal_token}"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_paralegal_can_upload_documents(
    client: AsyncClient,
    paralegal_token: str,
    lawyer_token: str,
    case_created_by_lawyer: str,
    db: AsyncSession,
):
    """Test paralegal can upload documents."""
    response = await client.post(
        f"/api/cases/{case_created_by_lawyer}/documents",
        headers={"Authorization": f"Bearer {paralegal_token}"},
        files={"file": ("doc.pdf", b"content", "application/pdf")},
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_paralegal_cannot_delete_cases(
    client: AsyncClient,
    paralegal_token: str,
    lawyer_token: str,
    case_created_by_lawyer: str,
):
    """Test paralegal cannot delete cases."""
    response = await client.delete(
        f"/api/cases/{case_created_by_lawyer}",
        headers={"Authorization": f"Bearer {paralegal_token}"},
    )
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_lawyer_can_delete_cases(
    client: AsyncClient,
    lawyer_token: str,
    case_created_by_lawyer: str,
):
    """Test lawyer can delete cases."""
    response = await client.delete(
        f"/api/cases/{case_created_by_lawyer}",
        headers={"Authorization": f"Bearer {lawyer_token}"},
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_paralegal_cannot_manage_users(
    client: AsyncClient, paralegal_token: str, db: AsyncSession
):
    """Test paralegal cannot manage users."""
    response = await client.post(
        "/api/users",
        headers={"Authorization": f"Bearer {paralegal_token}"},
        json={
            "email": "newuser@firm.com",
            "password": "SecurePass123!",
            "name": "New User",
            "role": "paralegal",
        },
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_lawyer_can_manage_users(
    client: AsyncClient, lawyer_token: str, db: AsyncSession
):
    """Test lawyer can manage users."""
    response = await client.post(
        "/api/users",
        headers={"Authorization": f"Bearer {lawyer_token}"},
        json={
            "email": "newuser@firm.com",
            "password": "SecurePass123!",
            "name": "New User",
            "role": "paralegal",
        },
    )
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_paralegal_cannot_update_case_sensitive_fields(
    client: AsyncClient,
    paralegal_token: str,
    lawyer_token: str,
    case_created_by_lawyer: str,
):
    """Test paralegal cannot update sensitive case fields."""
    response = await client.patch(
        f"/api/cases/{case_created_by_lawyer}",
        headers={"Authorization": f"Bearer {paralegal_token}"},
        json={"billing_rate": "500/hour"},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_paralegal_can_update_case_notes(
    client: AsyncClient,
    paralegal_token: str,
    lawyer_token: str,
    case_created_by_lawyer: str,
):
    """Test paralegal can update case notes."""
    response = await client.patch(
        f"/api/cases/{case_created_by_lawyer}",
        headers={"Authorization": f"Bearer {paralegal_token}"},
        json={"notes": "Updated case notes"},
    )
    assert response.status_code == 200
