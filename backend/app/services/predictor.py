import os
import pickle
import json
from datetime import datetime
from typing import Optional

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import LabelEncoder

from app.services.data import DataService

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
MODEL_PATH = os.path.join(MODELS_DIR, "salary_predictor.pkl")
ENCODERS_PATH = os.path.join(MODELS_DIR, "encoders.pkl")
MODEL_INFO_PATH = os.path.join(MODELS_DIR, "model_info.json")


class PredictorService:
    _model: Optional[RandomForestRegressor] = None
    _encoders: Optional[dict] = None
    _model_info: Optional[dict] = None
    _feature_columns: Optional[list] = None

    @classmethod
    def _ensure_model(cls):
        if cls._model is not None:
            return
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                cls._model = pickle.load(f)
            with open(ENCODERS_PATH, "rb") as f:
                cls._encoders = pickle.load(f)
            with open(MODEL_INFO_PATH, "r") as f:
                cls._model_info = json.load(f)
            cls._feature_columns = cls._model_info.get("feature_columns", [])
        else:
            cls.train()

    @classmethod
    def train(cls):
        df = DataService.get_raw()

        features = df[["work_year", "job_title", "job_category",
                        "experience_level", "company_location"]].copy()
        target = df["salary_in_usd"]

        encoders = {}
        categorical_cols = ["job_title", "job_category", "experience_level", "company_location"]
        for col in categorical_cols:
            le = LabelEncoder()
            features[col] = le.fit_transform(features[col].astype(str))
            encoders[col] = le

        X_train, X_test, y_train, y_test = train_test_split(
            features, target, test_size=0.2, random_state=42
        )

        model = RandomForestRegressor(
            n_estimators=200, max_depth=20, min_samples_leaf=5,
            random_state=42, n_jobs=-1
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        feature_names = features.columns.tolist()

        model_info = {
            "r2_score": round(float(r2_score(y_test, y_pred)), 4),
            "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
            "feature_importance": dict(zip(
                feature_names,
                [round(float(v), 4) for v in model.feature_importances_]
            )),
            "model_type": "RandomForestRegressor",
            "training_date": datetime.now().isoformat(),
            "feature_columns": feature_names,
            "n_samples": len(features),
        }

        os.makedirs(MODELS_DIR, exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(model, f)
        with open(ENCODERS_PATH, "wb") as f:
            pickle.dump(encoders, f)
        with open(MODEL_INFO_PATH, "w") as f:
            json.dump(model_info, f, indent=2)

        cls._model = model
        cls._encoders = encoders
        cls._model_info = model_info
        cls._feature_columns = feature_names

    @classmethod
    def predict(cls, work_year: int, job_title: str, job_category: str,
                experience_level: str, company_location: str) -> dict:
        cls._ensure_model()

        input_data = pd.DataFrame([[
            work_year, job_title, job_category, experience_level, company_location
        ]], columns=cls._feature_columns)

        for col in ["job_title", "job_category", "experience_level", "company_location"]:
            le = cls._encoders[col]
            input_data[col] = input_data[col].astype(str)
            known_classes = list(le.classes_)
            val = input_data[col].iloc[0]
            if val not in known_classes:
                input_data[col] = le.transform([known_classes[0]])[0]
            else:
                input_data[col] = le.transform([val])[0]

        prediction = cls._model.predict(input_data)[0]

        return {
            "predicted_salary_usd": round(float(prediction), 2),
            "confidence_interval": {
                "lower": round(float(prediction * 0.85), 2),
                "upper": round(float(prediction * 1.15), 2),
            },
            "model_used": "RandomForestRegressor",
        }

    @classmethod
    def get_model_info(cls) -> dict:
        cls._ensure_model()
        return cls._model_info
