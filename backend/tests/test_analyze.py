import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from models import DocumentStatus


@pytest.fixture
async def user_and_case(client: AsyncClient, db: AsyncSession):
    """Create user and case for testing."""
    # Signup
    response = await client.post(
        "/api/auth/signup",
        json={
            "email": "analyzer@firm.com",
            "password": "SecurePass123!",
            "name": "Analyzer",
            "firm_id": "firm-123",
        },
    )
    token = response.json()["access_token"]
    
    # Create case
    case_response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Case",
            "client_name": "Test Client",
            "description": "",
        },
    )
    case_id = case_response.json()["id"]
    
    return token, case_id


@pytest.mark.asyncio
async def test_analyze_returns_summary_parties_risks(
    client: AsyncClient, user_and_case, db: AsyncSession
):
    """Test /analyze returns JSON with summary, parties, risks keys."""
    token, case_id = user_and_case
    
    # Create document
    doc_response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("contract.pdf", b"fake contract", "application/pdf")},
    )
    doc_id = doc_response.json()["id"]
    
    # Mock LLM response
    mock_analysis = {
        "summary": "This is a service agreement between Company A and Company B.",
        "parties": ["Company A", "Company B"],
        "risks": [
            {"type": "liability", "severity": "high", "description": "Unlimited liability clause"},
            {"type": "termination", "severity": "medium", "description": "30-day termination notice"},
        ],
    }
    
    with patch("core.llm_client.complete_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = mock_analysis
        
        response = await client.post(
            f"/api/cases/{case_id}/documents/{doc_id}/analyze",
            headers={"Authorization": f"Bearer {token}"},
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "parties" in data
    assert "risks" in data
    assert isinstance(data["parties"], list)
    assert isinstance(data["risks"], list)


@pytest.mark.asyncio
async def test_analyze_returns_valid_structure(
    client: AsyncClient, user_and_case, db: AsyncSession
):
    """Test analyze returns properly structured response."""
    token, case_id = user_and_case
    
    # Create document
    doc_response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("doc.pdf", b"content", "application/pdf")},
    )
    doc_id = doc_response.json()["id"]
    
    mock_analysis = {
        "summary": "NDA agreement",
        "parties": ["Party A", "Party B"],
        "risks": [{"type": "confidentiality", "severity": "medium", "description": "Standard NDA"}],
    }
    
    with patch("core.llm_client.complete_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = mock_analysis
        
        response = await client.post(
            f"/api/cases/{case_id}/documents/{doc_id}/analyze",
            headers={"Authorization": f"Bearer {token}"},
        )
    
    data = response.json()
    assert isinstance(data["summary"], str)
    assert len(data["summary"]) > 0
    assert all(isinstance(p, str) for p in data["parties"])
    assert all("type" in r and "severity" in r for r in data["risks"])


@pytest.mark.asyncio
async def test_analyze_requires_auth(client: AsyncClient, user_and_case):
    """Test analyze endpoint requires authentication."""
    token, case_id = user_and_case
    
    response = await client.post(
        f"/api/cases/{case_id}/documents/doc-123/analyze",
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_analyze_document_not_found(
    client: AsyncClient, user_and_case
):
    """Test analyze returns 404 for nonexistent document."""
    token, case_id = user_and_case
    
    response = await client.post(
        f"/api/cases/{case_id}/documents/nonexistent-id/analyze",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_analyze_cross_firm_access_denied(
    client: AsyncClient, db: AsyncSession
):
    """Test analyze denies access to documents from another firm."""
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
    
    # User B creates case and document
    case_response = await client.post(
        "/api/cases",
        headers={"Authorization": f"Bearer {token_b}"},
        json={"title": "Case B", "client_name": "Client B", "description": ""},
    )
    case_id = case_response.json()["id"]
    
    doc_response = await client.post(
        f"/api/cases/{case_id}/documents",
        headers={"Authorization": f"Bearer {token_b}"},
        files={"file": ("doc.pdf", b"content", "application/pdf")},
    )
    doc_id = doc_response.json()["id"]
    
    # User A tries to analyze user B's document
    response = await client.post(
        f"/api/cases/{case_id}/documents/{doc_id}/analyze",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert response.status_code == 403
