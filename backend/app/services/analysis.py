import pandas as pd
import numpy as np
from app.services.data import DataService


class AnalysisService:

    @staticmethod
    def get_stats() -> dict:
        df = DataService.get_cleaned()
        return {
            "total_records": len(df),
            "avg_salary": round(df["salary_in_usd"].mean(), 2),
            "median_salary": round(df["salary_in_usd"].median(), 2),
            "salary_range": {
                "min": int(df["salary_in_usd"].min()),
                "max": int(df["salary_in_usd"].max())
            },
            "unique_job_titles": int(df["job_title"].nunique()),
            "unique_categories": int(df["job_category"].nunique()),
            "unique_countries": int(df["company_location"].nunique()),
            "year_range": [int(df["work_year"].min()), int(df["work_year"].max())],
        }

    @staticmethod
    def top_paying_jobs(n: int = 10) -> list:
        df = DataService.get_cleaned()
        grouped = df.groupby("job_title").agg(
            avg_salary=("salary_in_usd", "mean"),
            count=("salary_in_usd", "count"),
            category=("job_category", "first"),
        ).reset_index()
        grouped = grouped[grouped["count"] >= 3]
        grouped = grouped.sort_values("avg_salary", ascending=False).head(n)
        return grouped.to_dict(orient="records")

    @staticmethod
    def salary_by_experience() -> list:
        df = DataService.get_cleaned()
        exp_order = ["Entry-level", "Mid-level", "Senior", "Executive"]
        grouped = df.groupby("experience_level").agg(
            avg_salary=("salary_in_usd", "mean"),
            count=("salary_in_usd", "count"),
            min_salary=("salary_in_usd", "min"),
            max_salary=("salary_in_usd", "max"),
        ).reset_index()
        grouped["level"] = pd.Categorical(grouped["experience_level"], categories=exp_order, ordered=True)
        grouped = grouped.sort_values("level")
        return grouped.drop(columns=["level"]).to_dict(orient="records")

    @staticmethod
    def top_countries(min_records: int = 10) -> list:
        df = DataService.get_cleaned()
        country_counts = df["company_location"].value_counts()
        valid = country_counts[country_counts >= min_records].index
        filtered = df[df["company_location"].isin(valid)]
        grouped = filtered.groupby("company_location").agg(
            avg_salary=("salary_in_usd", "mean"),
            count=("salary_in_usd", "count"),
            median_salary=("salary_in_usd", "median"),
        ).reset_index()
        grouped = grouped.sort_values("avg_salary", ascending=False).head(10)
        grouped = grouped.rename(columns={"company_location": "country"})
        return grouped.to_dict(orient="records")

    @staticmethod
    def compare(job_titles=None, countries=None, experience_levels=None) -> dict:
        df = DataService.get_cleaned()
        result = {}

        if job_titles:
            filtered = df[df["job_title"].str.lower().isin([j.lower() for j in job_titles])]
            grouped = filtered.groupby("job_title")["salary_in_usd"].describe().reset_index()
            result["by_job"] = grouped.rename(columns={
                "job_title": "key", "25%": "p25", "50%": "p50", "75%": "p75"
            }).to_dict(orient="records")

        if countries:
            filtered = df[df["company_location"].str.lower().isin([c.lower() for c in countries])]
            grouped = filtered.groupby("company_location")["salary_in_usd"].describe().reset_index()
            result["by_country"] = grouped.rename(columns={
                "company_location": "key", "25%": "p25", "50%": "p50", "75%": "p75"
            }).to_dict(orient="records")

        if experience_levels:
            filtered = df[df["experience_level"].str.lower().isin([e.lower() for e in experience_levels])]
            grouped = filtered.groupby("experience_level")["salary_in_usd"].describe().reset_index()
            result["by_experience"] = grouped.rename(columns={
                "experience_level": "key", "25%": "p25", "50%": "p50", "75%": "p75"
            }).to_dict(orient="records")

        return result

    @staticmethod
    def get_filtered_data(work_year=None, job_category=None,
                          experience_level=None, company_location=None, limit=100) -> list:
        df = DataService.filter_cleaned(work_year, job_category, experience_level, company_location, limit)
        return df.to_dict(orient="records")

    @staticmethod
    def get_unique_values(column: str) -> list:
        return DataService.get_unique_values(column)
