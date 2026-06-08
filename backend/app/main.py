from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.candidates import router as candidates_router
from app.api.vacancies import router as vacancies_router
from app.api.matches import router as matches_router
from app.api.settings import router as settings_router
from app.db.db import engine, async_session_maker
from app.db.base import Base
from app.models.settings import AppSettings
from sqlalchemy import select

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаём таблицы если не существуют
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Создаём дефолтные настройки если их нет
    async with async_session_maker() as session:
        result = await session.scalar(select(AppSettings))
        if not result:
            session.add(AppSettings())
            await session.commit()
    
    yield


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Список разрешённых источников
    allow_credentials=True,  # Разрешить учётные данные (куки, Authorization)
    allow_methods=["*"],  # Разрешить все HTTP-методы
    allow_headers=["*"],  # Разрешить все заголовки
)


app.include_router(candidates_router)
app.include_router(vacancies_router)
app.include_router(matches_router)
app.include_router(settings_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Hello world!"
    }
