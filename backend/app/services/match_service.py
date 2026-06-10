from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from fastapi import Path, HTTPException
from app.models.match import Match
from app.models.candidate import Candidate
from app.models.vacancy import Vacancy
from app.models.settings import AppSettings
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
        weights_data = await db.scalar(select(AppSettings).where(AppSettings.id == 1))

        # Проверка существует ли
        if not weights_data:
            raise HTTPException(status_code=404, detail="Settings not found!")
        
        match_data = MatchAlgorithm.calculate_match(candidate, vacancy, weights_data)

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


    @staticmethod
    async def delete_match(
        candidate_id: Annotated[int, Path(description="ID кандидата", ge=1)],
        vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)],
        db: AsyncSession
    ):
        
        # Находим мэтч
        result = await db.scalar(select(Match).where(Match.candidate_id == candidate_id, Match.vacancy_id == vacancy_id))

        if not result:
            raise HTTPException(status_code=404, detail="Match not found!")
        
        await db.delete(result)
        await db.commit()

        return {"message": f"Match was successfully deleted"}
    

    @staticmethod
    async def get_matches_by_vacancy(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession):

        # Получить порог
        settings = await db.scalar(select(AppSettings).where(AppSettings.id == 1))

        # Проверка существует ли
        if not settings:
            raise HTTPException(status_code=404, detail="Settings not found!")
        
        threshold: int = settings.threshold

        # Проверяем существует ли вакансия
        vacancy = await db.scalar(select(Vacancy).where(Vacancy.id == vacancy_id))
        if not vacancy:
            raise HTTPException(status_code=404, detail="Vacancy not found!")

        # Получаем все мэтчи по вакансии с кандидатами
        result = await db.execute(
            select(Match, Candidate)
            .join(Candidate, Match.candidate_id == Candidate.id)
            .where(Match.vacancy_id == vacancy_id)
            .order_by(Match.total_score.desc(), Candidate.created_at.asc())
        )
        rows = result.all()

        # Присваиваем ранги
        ranked = []
        rank = 1
        for match, candidate in rows:
            passed = match.total_score >= threshold
            ranked.append({
                "candidate_id": candidate.id,
                "candidate_name": candidate.name,
                "vacancy_id": match.vacancy_id,
                "total_score": match.total_score,
                "matched_skills": match.matched_skills,
                "rank": rank if passed else None,
                "passed": passed
            })
            if passed:
                rank += 1

        return ranked
    

    @staticmethod
    async def create_matches_by_vacancy(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession) -> List[Match]:
        # Создать мэтчи со всеми кандидатами по одной вакансии

        # 1. Получить вакансию
        vacancy = await db.scalar(select(Vacancy).where(Vacancy.id == vacancy_id))
        if not vacancy:
            raise HTTPException(status_code=404, detail="Vacancy not found")
        
        # 2. Получить всех кандидатов (список)
        result = await db.execute(select(Candidate))
        candidates = result.scalars().all()
        if not candidates:
            raise HTTPException(status_code=404, detail="No candidates found")
        
        # 3. Получить настройки весов
        weights_data = await db.scalar(select(AppSettings).where(AppSettings.id == 1))
        if not weights_data:
            raise HTTPException(status_code=404, detail="Settings not found")
        
        # Удаляем старые мэтчи для этой вакансии
        await db.execute(delete(Match).where(Match.vacancy_id == vacancy_id))

        # 4. Подготовить список объектов Match
        db_matches = []
        for candidate in candidates:
            match_data = MatchAlgorithm.calculate_match(candidate, vacancy, weights_data)
            db_match = Match(
                candidate_id=candidate.id,
                vacancy_id=vacancy_id,
                **match_data
            )
            db_matches.append(db_match)
        
        # 5. Добавить все одной операцией и один коммит
        db.add_all(db_matches)
        await db.commit()
        
        # 6. Обновить объекты (чтобы получить ID, если нужны)
        for db_match in db_matches:
            await db.refresh(db_match)
        
        # 7. Вернуть список Response схем
        return [MatchResponse.model_validate(match) for match in db_matches]
    

    @staticmethod
    async def delete_all_matches(db: AsyncSession):
        # Удаляем все записи из таблицы matches

        result = await db.execute(delete(Match))
        await db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="No matches found to delete")
        
        return {"message": f"{result.rowcount} matches successfully deleted"}
    

    @staticmethod
    async def delete_matches_by_vacancy(vacancy_id: Annotated[int, Path(description="ID вакансии", ge=1)], db: AsyncSession):
        # Удаляем все записи из таблицы matches по вакансии

        result = await db.execute(delete(Match).where(Match.vacancy_id == vacancy_id))
        await db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="No matches found to delete")
        
        return {"message": f"{result.rowcount} matches successfully deleted"}
