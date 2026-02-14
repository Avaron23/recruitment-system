from fastapi import FastAPI
from app.api.candidates import router as candidates_router
from app.api.vacancies import router as vacancies_router


app = FastAPI()

app.include_router(candidates_router)
app.include_router(vacancies_router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Hello world!"
    }