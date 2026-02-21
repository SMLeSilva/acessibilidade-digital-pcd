from sqlmodel import Field, SQLModel, JSON, Column
from typing import Optional, List, Dict, Any
from datetime import datetime


class SiteAnalysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(index=True, unique=True)
    
    overall_score: float
    visual_score: float
    motor_score: float
    cognitive_score: float
    auditory_score: float
    
    issues_json: str = Field(default="[]", sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)