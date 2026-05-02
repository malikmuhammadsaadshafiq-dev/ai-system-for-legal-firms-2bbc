import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import UserModel, FirmModel, CaseModel


@pytest.fixture
async def user_a_token(client: AsyncClient, db: AsyncSession):
    """Create user A in firm A and return JWT."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "usera@firma.com",
            "password": "SecurePass123!",
            "name": "User A",
            "firm_id": "firm-a",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
async def user_b_token(client: AsyncClient, db: AsyncSession):
    """Create user B in firm B and return JWT."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "userb@firmb.com",
            "password": "SecurePass123!",
            "name": "User B",
            "firm_id": "firm-b",
        },
    )
    return response.json()["access_token"]


@pytest.fixture
async def firm_b_case(client: AsyncClient, user_b_token: str, db: AsyncSession):
    """Create a case in firm B."""
    response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {user_b_token}"},
        json={
            "title": "Case B",
            "client_name": "Client B",
            "description": "A case in firm B",
        },
    )
    return response.json()["id"]


@pytest.mark.asyncio
async def test_user_a_cannot_read_firm_b_cases(
    client: AsyncClient, user_a_token: str, user_b_token: str, firm_b_case: str
):
    """Test that user A (firm A) cannot read firm B cases (403)."""
    response = await client.get(
        f"/api/cases/{firm_b_case}",
        headers={"Authorization": f"Bearer {user_a_token}"},
    )
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_user_b_can_read_own_firm_cases(
    client: AsyncClient, user_b_token: str, firm_b_case: str
):
    """Test that user B can read cases in their firm."""
    response = await client.get(
        f"/api/cases/{firm_b_case}",
        headers={"Authorization": f"Bearer {user_b_token}"},
    )
    assert response.status_code == 200
    assert response.json()["id"] == firm_b_case


@pytest.mark.asyncio
async def test_user_a_cannot_list_firm_b_cases(
    client: AsyncClient, user_a_token: str, user_b_token: str, firm_b_case: str
):
    """Test that user A cannot see firm B cases in list."""
    # Create a case in firm A
    await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {user_a_token}"},
        json={
            "title": "Case A",
            "client_name": "Client A",
            "description": "A case in firm A",
        },
    )
    
    # List cases as user A
    response = await client.get(
        "/api/cases",
        headers={"Authorization": f"Bearer {user_a_token}"},
    )
    assert response.status_code == 200
    case_ids = [case["id"] for case in response.json()]
    # Firm B case should not be in the list
    assert firm_b_case not in case_ids


@pytest.mark.asyncio
async def test_user_a_cannot_update_firm_b_cases(
    client: AsyncClient, user_a_token: str, user_b_token: str, firm_b_case: str
):
    """Test that user A cannot update firm B cases (403)."""
    response = await client.patch(
        f"/api/cases/{firm_b_case}",
        headers={"Authorization": f"Bearer {user_a_token}"},
        json={"title": "Hacked Case B"},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_user_a_cannot_delete_firm_b_cases(
    client: AsyncClient, user_a_token: str, user_b_token: str, firm_b_case: str
):
    """Test that user A cannot delete firm B cases (403)."""
    response = await client.delete(
        f"/api/cases/{firm_b_case}",
        headers={"Authorization": f"Bearer {user_a_token}"},
    )
    assert response.status_code == 403
