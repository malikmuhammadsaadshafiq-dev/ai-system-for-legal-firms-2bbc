import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.fixture
async def user_and_case(client: AsyncClient, db: AsyncSession):
    """Create user and case for draft generation."""
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "drafter@firm.com",
            "password": "SecurePass123!",
            "name": "Drafter",
            "firm_id": "firm-123",
        },
    )
    token = response.json()["access_token"]
    
    case_response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Case",
            "client_name": "Test Client",
            "description": "A test case for drafting",
        },
    )
    case_id = case_response.json()["id"]
    
    return token, case_id


@pytest.mark.asyncio
async def test_draft_generation_produces_markdown(
    client: AsyncClient, user_and_case, db: AsyncSession
):
    """Test draft generation produces non-empty markdown."""
    token, case_id = user_and_case
    
    mock_draft = "# Draft Agreement\n\n## Parties\n- Company A\n- Company B\n\n## Terms\nStandard terms apply."
    
    with patch("core.llm_client.complete_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = mock_draft
        
        response = await client.post(
            f"/api/cases/{case_id}/draft",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "template": "service_agreement",
                "context": {
                    "company_a": "ACME Corp",
                    "company_b": "Widget Inc",
                },
            },
        )
    
    assert response.status_code == 201
    data = response.json()
    assert "content" in data
    assert len(data["content"]) > 0
    assert data["content"].startswith("#")  # Markdown header


@pytest.mark.asyncio
async def test_draft_generation_fills_template_variables(
    client: AsyncClient, user_and_case, db: AsyncSession
):
    """Test draft generation fills template variables."""
    token, case_id = user_and_case
    
    # Mock LLM returns draft with variables filled
    mock_draft = """# Service Agreement

This agreement is between **ACME Corp** and **Widget Inc**.

Effective Date: 2024-05-02

Service Period: 12 months"""
    
    with patch("core.llm_client.complete_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = mock_draft
        
        response = await client.post(
            f"/api/cases/{case_id}/draft",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "template": "service_agreement",
                "context": {
                    "company_a": "ACME Corp",
                    "company_b": "Widget Inc",
                    "service_period": "12 months",
                },
            },
        )
    
    assert response.status_code == 201
    content = response.json()["content"]
    assert "ACME Corp" in content
    assert "Widget Inc" in content
    assert "12 months" in content


@pytest.mark.asyncio
async def test_draft_generation_requires_auth(client: AsyncClient, user_and_case):
    """Test draft generation requires authentication."""
    token, case_id = user_and_case
    
    response = await client.post(
        f"/api/cases/{case_id}/draft",
        json={
            "template": "service_agreement",
            "context": {},
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_draft_generation_supports_multiple_templates(
    client: AsyncClient, user_and_case, db: AsyncSession
):
    """Test draft generation supports multiple templates."""
    token, case_id = user_and_case
    
    templates = ["service_agreement", "nda", "employment_contract", "general_contract"]
    
    for template in templates:
        mock_draft = f"# {template.upper()} DRAFT\n\nThis is a {template} template."
        
        with patch("core.llm_client.complete_text", new_callable=AsyncMock) as mock_llm:
            mock_llm.return_value = mock_draft
            
            response = await client.post(
                f"/api/cases/{case_id}/draft",
                headers={"Authorization": f"Bearer {token}"},
                json={"template": template, "context": {}},
            )
        
        assert response.status_code == 201


@pytest.mark.asyncio
async def test_draft_generation_case_not_found(
    client: AsyncClient, user_and_case
):
    """Test draft generation returns 404 for nonexistent case."""
    token, _ = user_and_case
    
    response = await client.post(
        "/api/cases/nonexistent-id/draft",
        headers={"Authorization": f"Bearer {token}"},
        json={"template": "service_agreement", "context": {}},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_draft_generation_cross_firm_access_denied(
    client: AsyncClient, db: AsyncSession
):
    """Test draft generation denies cross-firm access."""
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
    
    # User A tries to generate draft for user B's case
    response = await client.post(
        f"/api/cases/{case_id}/draft",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"template": "service_agreement", "context": {}},
    )
    assert response.status_code == 403
