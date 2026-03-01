from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Path, HTTPException
from app.models.vacancy import Vacancy
from app.schemas.vacancy import VacancyCreate, VacancyResponse
from typing import List, Annotated


class VacancyService:

    @staticmethod
    async def create_vacancy(data: VacancyCreate, db: AsyncSession) -> VacancyResponse:
        # Добавить вакансию в бд и вернуть его уже с айди

        # Создаём модель кандидата для добавления в бд
        db_vacancy = Vacancy(**data.model_dump())

        # Добавляем, коммитим, обновляем для получения айди
        db.add(db_vacancy)
        await db.commit()
        await db.refresh(db_vacancy)

        # Возвращаем
        return VacancyResponse.model_validate(db_vacancy)
    

    @staticmethod
    async def get_vacancies(db: AsyncSession) -> List[VacancyResponse]:
        # Получить все вакансии из БД и вернуть их

        result = await db.scalars(select(Vacancy))

        return result
    

    @staticmethod
    async def get_vacancy_by_id(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession):
        # Получить вакансию по её айди и вернуть её

        result = await db.scalar(select(Vacancy).where(Vacancy.id == vacancy_id))

        # Проверка существует ли
        if not result:
            raise HTTPException(status_code=404, detail="Vacancy not found!")
        
        # Если существует возвращаем 
        return result