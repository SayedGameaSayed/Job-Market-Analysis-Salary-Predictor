import os
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


class DataService:
    _df_raw: pd.DataFrame = None
    _df_cleaned: pd.DataFrame = None

    @classmethod
    def load_data(cls):
        raw_path = os.path.join(DATA_DIR, "jobs_in_data.csv")
        cleaned_path = os.path.join(DATA_DIR, "cleaned_jobs_data.csv")
        cls._df_raw = pd.read_csv(raw_path)
        cls._df_cleaned = pd.read_csv(cleaned_path)

    @classmethod
    def get_raw(cls) -> pd.DataFrame:
        if cls._df_raw is None:
            cls.load_data()
        return cls._df_raw.copy()

    @classmethod
    def get_cleaned(cls) -> pd.DataFrame:
        if cls._df_cleaned is None:
            cls.load_data()
        return cls._df_cleaned.copy()

    @classmethod
    def filter_cleaned(cls, work_year=None, job_category=None,
                       experience_level=None, company_location=None, limit=100):
        df = cls.get_cleaned()
        if work_year:
            df = df[df["work_year"] == work_year]
        if job_category:
            df = df[df["job_category"].str.lower() == job_category.lower()]
        if experience_level:
            df = df[df["experience_level"].str.lower() == experience_level.lower()]
        if company_location:
            df = df[df["company_location"].str.lower() == company_location.lower()]
        return df.head(limit)

    @classmethod
    def get_unique_values(cls, column: str) -> list:
        df = cls.get_raw()
        return sorted(df[column].dropna().unique().tolist())
