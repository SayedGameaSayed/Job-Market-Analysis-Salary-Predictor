from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_stats():
    resp = client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_records" in data
    assert data["total_records"] > 0


def test_top_jobs():
    resp = client.get("/api/top-jobs?n=5")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) <= 5


def test_salary_by_experience():
    resp = client.get("/api/salary-by-experience")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) > 0


def test_top_countries():
    resp = client.get("/api/top-countries?min_records=5")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) > 0


def test_filter():
    resp = client.get("/api/filter?limit=10")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) <= 10


def test_unique_values():
    resp = client.get("/api/unique-values/job_category")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) > 0


def test_predict():
    resp = client.post("/api/predict", json={
        "work_year": 2023,
        "job_title": "Data Scientist",
        "job_category": "Data Science and Research",
        "experience_level": "Senior",
        "company_location": "United States",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "predicted_salary_usd" in data


def test_model_info():
    resp = client.get("/api/model-info")
    assert resp.status_code == 200
    data = resp.json()
    assert "r2_score" in data


def test_export_csv():
    resp = client.get("/api/export/csv")
    assert resp.status_code == 200
    assert "text/csv" in resp.headers["content-type"]


def test_image_to_markdown():
    """Create a simple test image and verify the pipeline runs."""
    try:
        import cv2
        import numpy as np
        img = np.ones((400, 600, 3), dtype=np.uint8) * 255
        cv2.putText(img, "Dashboard Metrics", (50, 80), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 2)
        cv2.putText(img, "Total Records: 5341", (50, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
        cv2.putText(img, "Avg Salary: $146258", (50, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
        success, buf = cv2.imencode(".png", img)
        assert success
        resp = client.post("/api/image-to-markdown", files={"file": ("test.png", buf.tobytes(), "image/png")})
        assert resp.status_code == 200
        data = resp.json()
        assert "markdown" in data
    except ImportError:
        pass  # Skip if cv2 not available
