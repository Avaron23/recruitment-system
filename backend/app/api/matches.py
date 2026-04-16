from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.match import MatchCreate, MatchResponse
from app.db.db import get_db
from app.services.match_service import MatchService


# Создаём роутер мэтчей который подключается к main
router = APIRouter(prefix="/matches", tags=["Matches"])


# POST запрос на создание нового мэтча
@router.post("/", response_model=MatchResponse)
async def create_match(match: MatchCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по созданию и добавлению нового мэтча в БД
    return await MatchService.create_match(match, db)