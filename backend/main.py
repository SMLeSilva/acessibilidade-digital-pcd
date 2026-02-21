from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables
from app.api import analyses, recommendations

app = FastAPI(title="Plataforma de Acessibilidade Digital PcD", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyses.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"status": "online"}