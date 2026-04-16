from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Path, HTTPException
from app.models.match import Match
from app.schemas.match import MatchCreate, MatchResponse
from typing import List, Annotated


class MatchService:


    @staticmethod
    async def creat_match(data: MatchCreate, db: AsyncSession) -> MatchResponse:
        # TODO: Создать алгоритм скоринга и добавить мэтч в бд
        pass
