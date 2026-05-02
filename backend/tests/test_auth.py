import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import UserModel, FirmModel


@pytest.mark.asyncio
async def test_signup_success(client: AsyncClient, db: AsyncSession):
    """Test successful user signup returns JWT token."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "lawyer@firm.com",
            "password": "SecurePass123!",
            "name": "John Lawyer",
            "firm_id": "firm-123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == "lawyer@firm.com"


@pytest.mark.asyncio
async def test_signup_duplicate_email_rejected(client: AsyncClient, db: AsyncSession):
    """Test signup rejects duplicate email."""
    # Create first user
    await client.post(
        "/api/auth/signup",
        json={
            "email": "duplicate@firm.com",
            "password": "SecurePass123!",
            "name": "First User",
            "firm_id": "firm-123",
        },
    )
    
    # Try to create second user with same email
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "duplicate@firm.com",
            "password": "DifferentPass123!",
            "name": "Second User",
            "firm_id": "firm-123",
        },
    )
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db: AsyncSession):
    """Test successful login returns JWT token."""
    # Create user first
    await client.post(
        "/api/auth/signup",
        json={
            "email": "testuser@firm.com",
            "password": "SecurePass123!",
            "name": "Test User",
            "firm_id": "firm-123",
        },
    )
    
    # Login with credentials
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "testuser@firm.com",
            "password": "SecurePass123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient, db: AsyncSession):
    """Test login rejects invalid password."""
    # Create user first
    await client.post(
        "/api/auth/signup",
        json={
            "email": "testuser@firm.com",
            "password": "SecurePass123!",
            "name": "Test User",
            "firm_id": "firm-123",
        },
    )
    
    # Try login with wrong password
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "testuser@firm.com",
            "password": "WrongPassword123!",
        },
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    """Test login rejects nonexistent user."""
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@firm.com",
            "password": "SomePass123!",
        },
    )
    assert response.status_code == 401
