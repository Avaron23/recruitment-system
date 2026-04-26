from fastapi import APIRouter, Depends, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.vacancy import VacancyCreate, VacancyResponse
from app.db.db import get_db
from app.services.vacancy_service import VacancyService
from typing import List, Annotated


# Создаём роутер вакансий который подключается к main
router = APIRouter(prefix="/vacancies", tags=["Vacancies"])


# POST запрос для добавления вакансии в БД
@router.post("/", response_model=VacancyResponse)
async def create_vacancy(vacancy: VacancyCreate, db: AsyncSession = Depends(get_db)):
    
    # Вызываем сервис по добавлению вакансии в бд
    return await VacancyService.create_vacancy(vacancy, db)


# GET запрос на получение всех вакансий из БД
@router.get("/", response_model=List[VacancyResponse])
async def get_vacancies(db: AsyncSession = Depends(get_db)):

    # Вызываем сервис по получению вакансий из БД 
    return await VacancyService.get_vacancies(db)


# GET запрос на получение одной вакансии по её айди
@router.get("/{vacancy_id}", response_model=VacancyResponse)
async def get_vacancy_by_id(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession = Depends(get_db)):

    # Вызываем сервис по получению одной вакансии по её айди
    return await VacancyService.get_vacancy_by_id(vacancy_id, db)


# DELETE запрос на удаления вакансии из БД по её айди
@router.delete("/{vacancy_id}", status_code=status.HTTP_200_OK)
async def delete_vacancy_by_id(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession = Depends(get_db)):

    # Вызываем сервис для удаления вакансии по её айди
    return await VacancyService.delete_vacancy_by_id(vacancy_id, db)