from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Path, HTTPException
from app.models.match import Match
from app.models.candidate import Candidate
from app.models.vacancy import Vacancy
from app.schemas.match import MatchCreate, MatchResponse
from app.services.match_algorithm import MatchAlgorithm
from typing import List, Annotated


class MatchService:


    @staticmethod
    async def create_match(data: MatchCreate, db: AsyncSession) -> MatchResponse:

        # Получить кандидата и вакансию
        candidate = await db.scalar(select(Candidate).where(Candidate.id == data.candidate_id))
        vacancy = await db.scalar(select(Vacancy).where(Vacancy.id == data.vacancy_id))

        if not candidate or not vacancy:
            raise HTTPException(status_code=404, detail="Candidate or vacancy not found")
        
        # Вызвать алгоритм скорнинга
        match_data = MatchAlgorithm.calculate_match(candidate, vacancy)

        # Добавить в бд
        db_match = Match(
            candidate_id=data.candidate_id,
            vacancy_id=data.vacancy_id,
            **match_data
        )
        
        db.add(db_match)
        await db.commit()

        return MatchResponse.model_validate(db_match)
    

    @staticmethod
    async def get_matches(db: AsyncSession) -> List[Match]:
        # Получить все мэтчи из бд и вернуть их

        result = await db.scalars(select(Match))

        return result
