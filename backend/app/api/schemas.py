from pydantic import BaseModel, Field
from typing import Optional, List


class FilterParams(BaseModel):
    work_year: Optional[int] = None
    job_category: Optional[str] = None
    experience_level: Optional[str] = None
    company_location: Optional[str] = None
    limit: int = Field(default=100, le=1000)


class CompareRequest(BaseModel):
    job_titles: List[str] = []
    countries: List[str] = []
    experience_levels: List[str] = []


class PredictRequest(BaseModel):
    work_year: int = Field(default=2023, ge=2020, le=2024)
    job_title: str
    job_category: str
    experience_level: str
    company_location: str


class PredictResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    predicted_salary_usd: float
    confidence_interval: Optional[dict] = None
    model_used: str


class StatsResponse(BaseModel):
    total_records: int
    avg_salary: float
    median_salary: float
    salary_range: dict
    unique_job_titles: int
    unique_categories: int
    unique_countries: int
    year_range: list


class JobSalaryResponse(BaseModel):
    job_title: str
    avg_salary: float
    count: int
    category: Optional[str] = None


class CountrySalaryResponse(BaseModel):
    country: str
    avg_salary: float
    count: int
    median_salary: float


class ExperienceSalaryResponse(BaseModel):
    level: str
    avg_salary: float
    count: int
    min_salary: float
    max_salary: float


class ComparisonResponse(BaseModel):
    by_job: Optional[dict] = None
    by_country: Optional[dict] = None
    by_experience: Optional[dict] = None


class ModelInfoResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    r2_score: float
    mae: float
    rmse: float
    feature_importance: dict
    model_type: str
    training_date: str
