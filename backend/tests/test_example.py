from fastapi.testclient import TestClient

from app.main import app


def test_root_responds():
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
