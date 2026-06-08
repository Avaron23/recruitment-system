from pydantic import BaseModel, ConfigDict, Field
from typing import List


class VacancyCreate(BaseModel):
    title: str 
    required_experience: int
    required_education: str
    required_skills: List[str]
    preferred_skills: List[str]
    salary_offer: int
    relocation_required: bool

    is_experience_mandatory: bool
    is_education_mandatory: bool
    is_salary_mandatory: bool
    is_relocation_mandatory: bool

    model_config = ConfigDict(from_attributes=True)

class VacancyResponse(BaseModel):
    id: int
    title: str 
    required_experience: int
    required_education: str
    required_skills: List[str]
    preferred_skills: List[str]
    salary_offer: int
    relocation_required: bool

    is_experience_mandatory: bool = Field(default=False)
    is_education_mandatory: bool = Field(default=False)
    is_salary_mandatory: bool = Field(default=False)
    is_relocation_mandatory: bool = Field(default=False)

    model_config = ConfigDict(from_attributes=True)