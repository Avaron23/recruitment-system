from sqlalchemy.ext.asyncio import AsyncSession
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate, CandidateResponse


class CandidateService:

    @staticmethod
    async def create_candidate(data: CandidateCreate, db: AsyncSession) -> CandidateResponse:
        # Добавить кандидата в бд и вернуть его уже с айди

        # Создаём модель кандидата для добавления в бд
        db_candidate = Candidate(**data.model_dump())

        # Добавляем, коммитим, обновляем для получения айди
        db.add(db_candidate)
        await db.commit()
        await db.refresh(db_candidate)

        # Возвращаем
        return CandidateResponse.model_validate(db_candidate)
