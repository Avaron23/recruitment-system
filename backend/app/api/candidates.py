from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.candidate import CandidateResponse, CandidateCreate
from app.db.db import get_db
from app.services.candidate_service import CandidateService
from typing import List, Annotated


# Создаём роутер кандидатов который подключается к main
router = APIRouter(prefix="/candidates", tags=["Candidates"])


# POST запрос для добавления кандидата в БД
@router.post("/", response_model=CandidateResponse)
async def create_candidate(candidate: CandidateCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по добавлению кандидата в БД
    return await CandidateService.create_candidate(candidate, db)


# GET запрос на получение всех кандидатов из БД
@router.get("/", response_model=List[CandidateResponse])
async def get_candidates(db: AsyncSession = Depends(get_db)):

    # Вызываем сервис для получения всех кандидатов из айди
    return await CandidateService.get_candidates(db)


# GET запрос на получение одного кандидата по его айди
@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate_by_id(candidate_id: Annotated[int, Path(description="ID кандидата", ge=1)], db: AsyncSession = Depends(get_db)):

    # Вызываем сервис для получения кандидата по его айди
    return await CandidateService.get_candidate_by_id(candidate_id, db)