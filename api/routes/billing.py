from fastapi import APIRouter, Depends, HTTPException
from ..models import User
from ..schemas import CheckoutRequest
from ..auth import get_current_user
import os

router = APIRouter(tags=["billing"])


@router.post("/api/billing/checkout")
async def create_checkout(
    body: CheckoutRequest,
    user: User = Depends(get_current_user),
):
    """Create a Stripe Checkout session (or return stub when key is absent)."""
    stripe_key = os.getenv("STRIPE_SECRET_KEY", "")

    if stripe_key:
        try:
            import stripe
            stripe.api_key = stripe_key
            session = stripe.checkout.Session.create(
                customer_email=user.email,
                line_items=[{"price": body.plan, "quantity": 1}],
                mode="subscription",
                success_url=body.success_url,
                cancel_url=body.cancel_url,
            )
            return {"checkout_url": session.url, "session_id": session.id}
        except Exception as e:
            raise HTTPException(500, f"Stripe error: {e}")

    # Stub — wire up real Stripe via STRIPE_SECRET_KEY env var
    return {
        "checkout_url": f"{body.success_url}?stub=true&plan={body.plan}",
        "session_id": "stub_session_id",
        "plan": body.plan,
        "message": "Stripe not configured — stub response",
    }
