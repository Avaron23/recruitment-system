from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.candidate import CandidateResponse, CandidateCreate
from app.db.db import get_db
from app.services.candidate_service import CandidateService
from app.models.candidate import Candidate


router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.post("/", response_model=CandidateResponse)
async def create_candidate(candidate: CandidateCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по добавлению кандидата в бд
    return await CandidateService.create_candidate(candidate, db)