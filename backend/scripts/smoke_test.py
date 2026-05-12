from fastapi.testclient import TestClient

from app.main import app


def test_health():
    """Simple smoke test: verifies the app responds on /health or /."""
    client = TestClient(app)

    # Prefer explicit /health endpoint if available
    for path in ("/health", "/"): 
        resp = client.get(path)
        if resp.status_code == 200:
            data = {}
            try:
                data = resp.json()
            except Exception:
                pass
            # Accept a few variants for status key
            status = data.get("status") if isinstance(data, dict) else None
            if status and status.lower() in ("healthy", "ok"):
                return
            # If root returns 200 without JSON, treat it as success
            if not data:
                return

    # If we got here, no suitable 200 response found
    raise AssertionError("App did not respond with a healthy 200 on /health or /")


if __name__ == "__main__":
    test_health()
    print("SMOKE TEST: backend healthy")
