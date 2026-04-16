from pydantic import BaseModel, ConfigDict
from typing import List


class VacancyCreate(BaseModel):
    title: str 
    required_experience: int
    required_education: str
    required_skills: List[str]
    salary_offer: int
    relocation_required: bool

    model_config = ConfigDict(from_attributes=True)

class VacancyResponse(BaseModel):
    id: int
    title: str 
    required_experience: int
    required_education: str
    required_skills: List[str]
    salary_offer: int
    relocation_required: bool

    model_config = ConfigDict(from_attributes=True)