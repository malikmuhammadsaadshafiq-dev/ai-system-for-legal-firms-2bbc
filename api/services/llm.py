"""NVIDIA NIM (kimi-k2-instruct) client for document analysis and draft generation."""
from openai import AsyncOpenAI
import os, json, asyncio

_client = AsyncOpenAI(
    api_key=os.getenv("NVIDIA_API_KEY", ""),
    base_url=os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1"),
    timeout=300.0,
)
MODEL = os.getenv("NVIDIA_MODEL", "moonshotai/kimi-k2-instruct")


async def analyze_document(text: str) -> dict:
    """Extract clauses, parties, dates, risks from document text."""
    prompt = (
        "Analyze this legal document. Return a JSON object with keys: "
        "summary (string), parties (list), dates (list), clauses (list), risks (list).\n\n"
        f"Document:\n{text[:4000]}\n\nReturn only valid JSON, no markdown."
    )
    for attempt in range(2):
        try:
            resp = await _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000,
            )
            content = resp.choices[0].message.content or "{}"
            start, end = content.find("{"), content.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(content[start:end])
            return {"summary": content, "risks": [], "parties": [], "dates": [], "clauses": []}
        except Exception as e:
            if attempt == 0:
                await asyncio.sleep(60)
            else:
                return {"error": str(e), "summary": "", "risks": [], "parties": [], "dates": [], "clauses": []}
    return {}


async def generate_draft(template_body: str, facts: str) -> str:
    """Complete a legal document template with provided facts."""
    prompt = (
        "Complete this legal document template using the facts below. "
        "Return the completed document in markdown.\n\n"
        f"Template:\n{template_body[:2000]}\n\nFacts:\n{facts[:2000]}"
    )
    for attempt in range(2):
        try:
            resp = await _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2000,
            )
            return resp.choices[0].message.content or ""
        except Exception as e:
            if attempt == 0:
                await asyncio.sleep(60)
            else:
                return f"Draft generation failed: {e}"
    return ""
