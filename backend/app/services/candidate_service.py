from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Path, HTTPException
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate, CandidateResponse
from typing import List, Annotated


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


    @staticmethod
    async def get_candidates(db: AsyncSession) -> List[CandidateResponse]:
        # Получить всех кандидатов из бд и вернуть их

        result = await db.scalars(select(Candidate))

        return result
    

    @staticmethod
    async def get_candidate_by_id(candidate_id: Annotated[int, Path(description="ID кандидата", ge=1)], db: AsyncSession):
        # Получить кандидата по его айди и вернуть его

        result = await db.scalar(select(Candidate).where(Candidate.id == candidate_id))

        # Проверка существует ли
        if not result:
            raise HTTPException(status_code=404, detail="Candidate not found!")
        
        # Если существует возвращаем 
        return result