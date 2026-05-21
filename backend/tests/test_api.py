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
    assert resp.headers["content-type"] == "text/csv"
