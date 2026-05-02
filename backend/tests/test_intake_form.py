import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import IntakeSubmissionModel


@pytest.mark.asyncio
async def test_intake_form_public_submission_persists(
    client: AsyncClient, db: AsyncSession
):
    """Test public intake form submission persists payload to database."""
    payload = {
        "client_name": "Jane Doe",
        "client_email": "jane@example.com",
        "client_phone": "+1-555-0123",
        "case_type": "employment",
        "description": "I was wrongfully terminated from my job.",
        "preferred_contact": "email",
    }
    
    response = await client.post(
        "/api/public/intake",
        json=payload,
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    submission_id = data["id"]
    
    # Verify data persisted in database
    result = await db.execute(
        select(IntakeSubmissionModel).where(
            IntakeSubmissionModel.id == submission_id
        )
    )
    submission = result.scalar_one()
    assert submission is not None
    assert submission.client_name == "Jane Doe"
    assert submission.client_email == "jane@example.com"
    assert submission.case_type == "employment"
    assert submission.description == "I was wrongfully terminated from my job."


@pytest.mark.asyncio
async def test_intake_form_preserves_all_fields(
    client: AsyncClient, db: AsyncSession
):
    """Test intake form preserves all submitted fields."""
    payload = {
        "client_name": "John Smith",
        "client_email": "john@example.com",
        "client_phone": "+1-555-9876",
        "case_type": "contract",
        "description": "Dispute over service agreement terms",
        "preferred_contact": "phone",
        "firm_id": "firm-123",
    }
    
    response = await client.post("/api/public/intake", json=payload)
    assert response.status_code == 201
    
    result = await db.execute(
        select(IntakeSubmissionModel).where(
            IntakeSubmissionModel.client_email == "john@example.com"
        )
    )
    submission = result.scalar_one()
    assert submission.client_phone == "+1-555-9876"
    assert submission.preferred_contact == "phone"


@pytest.mark.asyncio
async def test_intake_form_requires_name_and_email(client: AsyncClient):
    """Test intake form requires name and email."""
    # Missing name
    response = await client.post(
        "/api/public/intake",
        json={
            "client_email": "test@example.com",
            "case_type": "employment",
            "description": "Test",
        },
    )
    assert response.status_code == 422
    
    # Missing email
    response = await client.post(
        "/api/public/intake",
        json={
            "client_name": "Test User",
            "case_type": "employment",
            "description": "Test",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_intake_form_validates_email(client: AsyncClient):
    """Test intake form validates email format."""
    response = await client.post(
        "/api/public/intake",
        json={
            "client_name": "Test User",
            "client_email": "invalid-email",
            "case_type": "employment",
            "description": "Test",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_intake_form_no_auth_required(client: AsyncClient):
    """Test intake form is publicly accessible without authentication."""
    response = await client.post(
        "/api/public/intake",
        json={
            "client_name": "Public User",
            "client_email": "public@example.com",
            "case_type": "other",
            "description": "Public submission",
        },
    )
    assert response.status_code == 201
    # No Authorization header needed


@pytest.mark.asyncio
async def test_intake_form_case_type_validation(client: AsyncClient):
    """Test intake form validates case type."""
    valid_types = ["employment", "contract", "intellectual_property", "other"]
    
    for case_type in valid_types:
        response = await client.post(
            "/api/public/intake",
            json={
                "client_name": "User",
                "client_email": f"user-{case_type}@example.com",
                "case_type": case_type,
                "description": "Test",
            },
        )
        assert response.status_code == 201
    
    # Test invalid case type
    response = await client.post(
        "/api/public/intake",
        json={
            "client_name": "User",
            "client_email": "user@example.com",
            "case_type": "invalid_type",
            "description": "Test",
        },
    )
    assert response.status_code == 422
