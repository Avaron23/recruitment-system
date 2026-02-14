from sqlalchemy.ext.asyncio import AsyncSession
from app.models.vacancy import Vacancy
from app.schemas.vacancy import VacancyCreate, VacancyResponse


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