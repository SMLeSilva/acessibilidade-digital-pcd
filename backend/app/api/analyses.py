from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, HttpUrl
from sqlmodel import Session, select
import json

from app.utils.scraper import fetch_and_parse
from app.core.analyzer import analyze_accessibility
from app.core.scoring import calculate_scores
from app.db.database import get_session
from app.db.models import SiteAnalysis


router = APIRouter()


class AnalyzeRequest(BaseModel):
    url: HttpUrl = "https://www.google.com"

def normalize_url(url: str) -> str:
    return url.rstrip("/")


@router.post("/")
async def analyze_url(request: AnalyzeRequest, session: Session = Depends(get_session)):
    target_url = normalize_url(str(request.url))

    existing_analysis = session.exec(select(SiteAnalysis).where(SiteAnalysis.url == target_url)).first()
    if existing_analysis:
        return {
            "id": existing_analysis.id,
            "url": existing_analysis.url,
            "scores": {
                "overall_score": existing_analysis.overall_score,
                "visual_score": existing_analysis.visual_score,
                "motor_score": existing_analysis.motor_score,
                "cognitive_score": existing_analysis.cognitive_score,
                "auditory_score": existing_analysis.auditory_score,
            },
            "total_issues": len(json.loads(existing_analysis.issues_json)),
            "issues": json.loads(existing_analysis.issues_json)
        }

    soup = await fetch_and_parse(target_url)
    if not soup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não foi possível acessar a URL informada. Verifique se o site está no ar ou se a URL é válida."
        )
    
    issues = analyze_accessibility(soup)
    scores = calculate_scores(issues)
    
    analysis_record = SiteAnalysis(
        url=target_url,
        overall_score=scores["overall_score"],
        visual_score=scores["visual_score"],
        motor_score=scores["motor_score"],
        cognitive_score=scores["cognitive_score"],
        auditory_score=scores["auditory_score"],
        issues_json=json.dumps(issues)
    )
    
    session.add(analysis_record)
    session.commit()
    session.refresh(analysis_record)
    
    return {
        "id": analysis_record.id,
        "url": analysis_record.url,
        "scores": scores,
        "total_issues": len(issues),
        "issues": issues
    }