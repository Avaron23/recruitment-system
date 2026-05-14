from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.candidates import router as candidates_router
from app.api.vacancies import router as vacancies_router
from app.api.matches import router as matches_router


app = FastAPI()


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

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Hello world!"
    }
