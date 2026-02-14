from pydantic import BaseModel, ConfigDict
from typing import List


class VacancyCreate(BaseModel):
    title: str 
    required_experience: int
    required_education: str
    required_skills: list[str]
    min_resume_score: int
    min_interview_score: int
    min_tests_score: int
    salary_offer: int
    min_recomendation_score: int 

    model_config = ConfigDict(from_attributes=True)

class VacancyResponse(BaseModel):
    id: int
    title: str 
    required_experience: int
    required_education: str
    required_skills: list[str]
    min_resume_score: int
    min_interview_score: int
    min_tests_score: int
    salary_offer: int
    min_recomendation_score: int 

    model_config = ConfigDict(from_attributes=True)