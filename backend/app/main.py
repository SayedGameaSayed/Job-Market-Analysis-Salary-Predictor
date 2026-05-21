import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api.routes import router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.services.data import DataService
    DataService.load_data()
    yield


app = FastAPI(
    title="Job Market Analysis & Salary Predictor API",
    description="Analyze global data science salaries, compare roles, and predict compensation.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "healthy"}
