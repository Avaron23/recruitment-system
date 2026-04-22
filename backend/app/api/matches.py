from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.match import MatchCreate, MatchResponse
from app.db.db import get_db
from app.services.match_service import MatchService
from typing import List


# Создаём роутер мэтчей который подключается к main
router = APIRouter(prefix="/matches", tags=["Matches"])


# POST запрос на создание нового мэтча
@router.post("/", response_model=MatchResponse)
async def create_match(match: MatchCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по созданию и добавлению нового мэтча в БД
    return await MatchService.create_match(match, db)


# GET запрос на получение всех мэтчей из БД
@router.get("/", response_model=List[MatchResponse])
async def get_matches(db: AsyncSession = Depends(get_db)):

    # Вызываем сервис по получению всех мэтчей из БД
    return await MatchService.get_matches(db)