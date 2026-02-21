from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.vacancy import VacancyCreate, VacancyResponse
from app.db.db import get_db
from app.services.vacancy_service import VacancyService


# Создаём роутер вакансий который подключается к main
router = APIRouter(prefix="/vacancies", tags=["Vacancies"])


# POST запрос для добавления вакансии в БД
@router.post("/", response_model=VacancyResponse)
async def create_candidate(vacancy: VacancyCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по добавлению вакансии в бд
    return await VacancyService.create_vacancy(vacancy, db)