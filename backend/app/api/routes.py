from typing import Optional

from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response

from app.api.schemas import (
    CompareRequest, PredictRequest, FilterParams,
)
from app.services.analysis import AnalysisService
from app.services.predictor import PredictorService
from app.utils.exporters import export_csv, export_pdf
from app.utils.helpers import logger

router = APIRouter()


@router.get("/stats")
async def get_stats():
    try:
        return AnalysisService.get_stats()
    except Exception as e:
        logger.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-jobs")
async def get_top_jobs(n: int = Query(default=10, ge=1, le=50)):
    try:
        return AnalysisService.top_paying_jobs(n)
    except Exception as e:
        logger.error(f"Top jobs error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/salary-by-experience")
async def get_salary_by_experience():
    try:
        return AnalysisService.salary_by_experience()
    except Exception as e:
        logger.error(f"Salary by experience error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-countries")
async def get_top_countries(min_records: int = Query(default=10, ge=1)):
    try:
        return AnalysisService.top_countries(min_records)
    except Exception as e:
        logger.error(f"Top countries error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/filter")
async def filter_data(
    work_year: Optional[int] = None,
    job_category: Optional[str] = None,
    experience_level: Optional[str] = None,
    company_location: Optional[str] = None,
    limit: int = Query(default=100, le=1000),
):
    try:
        return AnalysisService.get_filtered_data(
            work_year, job_category, experience_level, company_location, limit
        )
    except Exception as e:
        logger.error(f"Filter error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare")
async def compare_data(req: CompareRequest):
    try:
        result = AnalysisService.compare(
            job_titles=req.job_titles or None,
            countries=req.countries or None,
            experience_levels=req.experience_levels or None,
        )
        if not any(result.values()):
            raise HTTPException(status_code=404, detail="No matching data found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Compare error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/unique-values/{column}")
async def get_unique_values(column: str):
    allowed = ["job_title", "job_category", "experience_level",
               "company_location", "work_year", "employment_type",
               "work_setting", "company_size"]
    if column not in allowed:
        raise HTTPException(status_code=400, detail=f"Column must be one of: {allowed}")
    try:
        return AnalysisService.get_unique_values(column)
    except Exception as e:
        logger.error(f"Unique values error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
async def predict_salary(req: PredictRequest):
    try:
        return PredictorService.predict(
            work_year=req.work_year,
            job_title=req.job_title,
            job_category=req.job_category,
            experience_level=req.experience_level,
            company_location=req.company_location,
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model-info")
async def model_info():
    try:
        return PredictorService.get_model_info()
    except Exception as e:
        logger.error(f"Model info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export/csv")
async def export_data_csv(
    work_year: Optional[int] = None,
    job_category: Optional[str] = None,
    experience_level: Optional[str] = None,
):
    try:
        csv_content = export_csv(work_year, job_category, experience_level)
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=salary_data.csv"},
        )
    except Exception as e:
        logger.error(f"CSV export error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export/pdf")
async def export_data_pdf(
    work_year: Optional[int] = None,
    job_category: Optional[str] = None,
    experience_level: Optional[str] = None,
):
    try:
        pdf_bytes = export_pdf(work_year, job_category, experience_level)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=salary_report.pdf"},
        )
    except Exception as e:
        logger.error(f"PDF export error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
