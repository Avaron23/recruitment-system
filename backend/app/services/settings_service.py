from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Path, HTTPException
from app.models.settings import AppSettings
from app.schemas.settings import SettingsCreate
from typing import List, Annotated


class SettingsService:


    @staticmethod
    async def get_settings(db: AsyncSession):
        # Получить настройки и вернуть их

        result = await db.scalar(select(AppSettings).where(AppSettings.id == 1))

        # Проверка существует ли
        if not result:
            raise HTTPException(status_code=404, detail="Settings not found!")
        
        # Если существует возвращаем 
        return result
    

    @staticmethod
    async def edit_settings(data: SettingsCreate, db: AsyncSession):
        # Изменить настройки и вернуть их

        result = await db.scalar(select(AppSettings).where(AppSettings.id == 1))

        # Проверка существует ли
        if not result:
            raise HTTPException(status_code=404, detail="Settings not found!")
        
        # Проверка суммы весов — только веса, без threshold
        weights = {k: v for k, v in data.model_dump().items() if k != "threshold"}
        weights_sum = round(sum(weights.values()), 10)

        if abs(weights_sum - 1.0) > 0.001:
            raise HTTPException(
                status_code=400,
                detail=f"Сумма весов должна быть равна 1! Текущая сумма: {weights_sum}"
            )

        # Если всё проходит изменяем
        for field, value in data.model_dump().items():
            setattr(result, field, value)

        await db.commit()
        await db.refresh(result)

        return result