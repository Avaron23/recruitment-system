from fastapi import APIRouter, Depends, status, Path
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.settings import SettingsResponse, SettingsCreate
from app.db.db import get_db
from app.services.settings_service import SettingsService
from typing import List, Annotated


# Создаём роутер
router = APIRouter(prefix="/settings", tags=["Settings"])


# GET запрос на получение весов и порога
@router.get("/", response_model=SettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):

    # Вызываем сервис по получению настроек
    return await SettingsService.get_settings(db)


# PUT запрос на изменение настроек
@router.put("/", response_model=SettingsResponse)
async def edit_settings(settings: SettingsCreate, db: AsyncSession = Depends(get_db)):

    # Вызывапем сервис по изменению настроек
    return await SettingsService.edit_settings(settings, db)