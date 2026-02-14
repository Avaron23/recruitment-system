from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.vacancy import VacancyCreate, VacancyResponse
from app.db.db import get_db
from app.services.vacancy_service import VacancyService


router = APIRouter(prefix="/vacancies", tags=["Vacancies"])


@router.post("/", response_model=VacancyResponse)
async def create_candidate(vacancy: VacancyCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по добавлению кандидата в бд
    return await VacancyService.create_vacancy(vacancy, db)