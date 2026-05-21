# 📊 SalaryInsight — Job Market Analysis & Salary Predictor

A full-stack data science application that analyzes global data science job salaries, compares roles across countries, and predicts expected compensation using a Random Forest model.

## 🚀 Features

- **Interactive Dashboard** — Key stats, top-paying jobs, salary by experience, and country comparison
- **Salary Predictor** — ML-powered salary prediction using Random Forest (R² ~0.7)
- **Data Explorer** — Filter, search, and paginate through 5,000+ salary records
- **Comparison Tool** — Side-by-side salary comparison across job titles, countries, and experience levels
- **Export Reports** — Download filtered data as CSV or generate PDF reports
- **Dark/Light Theme** — Toggle between dark and light mode
- **Docker Support** — One-command deployment with docker-compose

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.11) |
| Frontend | React + Vite, MUI, Recharts |
| ML Model | Random Forest Regressor (scikit-learn) |
| Database | CSV (pandas) |
| Deployment | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## 🛠️ Quick Start

### Prerequisites
- Python 3.11+, Node.js 20+, or Docker

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Docker (Production)
```bash
docker-compose up --build
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dataset overview |
| GET | `/api/top-jobs` | Top paying jobs |
| GET | `/api/salary-by-experience` | Salary per level |
| GET | `/api/top-countries` | Top countries |
| GET | `/api/filter` | Filtered data |
| POST | `/api/compare` | Side-by-side compare |
| POST | `/api/predict` | Predict salary |
| GET | `/api/model-info` | Model metrics |
| GET | `/api/export/csv` | Export CSV |
| GET | `/api/export/pdf` | Export PDF |

## 📊 Model Performance

The Random Forest model is trained on ~7,500 records with features: work_year, job_title, job_category, experience_level, company_location.

- **R² Score:** ~0.70
- **MAE:** ~$25,000
- **Feature Importance:** Job title and experience level are the strongest predictors.

## 📁 Project Structure

```
├── backend/          # FastAPI backend
│   ├── app/          # Application code
│   │   ├── api/      # Routes & schemas
│   │   ├── services/ # Business logic & ML
│   │   └── utils/    # Exporters & helpers
│   ├── data/         # CSV datasets
│   ├── models/       # Trained .pkl models
│   └── tests/        # API tests
├── frontend/         # React + Vite frontend
│   └── src/
│       ├── api/      # API client
│       ├── components/ # UI components
│       ├── context/  # Theme context
│       └── pages/    # Route pages
└── docker-compose.yml
```

## 📝 License

MIT
