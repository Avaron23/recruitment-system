from pydantic import BaseModel, ConfigDict
from typing import List


class CandidateCreate(BaseModel):
    name: str 
    experience: int
    education: str 
    skills: List[str]
    resume_score: int
    interview_score: int
    tests_score: int
    desired_salary: int
    recomendation_score: int

class CandidateResponse(BaseModel):
    id: int
    name: str 
    experience: int
    education: str 
    skills: List[str]
    resume_score: int
    interview_score: int
    tests_score: int
    desired_salary: int
    recomendation_score: int

    model_config = ConfigDict(from_attributes=True)