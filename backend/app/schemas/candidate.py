from pydantic import BaseModel, ConfigDict
from typing import List


class CandidateCreate(BaseModel):
    name: str 
    experience: int
    education: str 
    skills: List[str]
    desired_salary: int
    can_relocate: bool

    model_config = ConfigDict(from_attributes=True)

class CandidateResponse(BaseModel):
    id: int
    name: str 
    experience: int
    education: str 
    skills: List[str]
    desired_salary: int
    can_relocate: bool

    model_config = ConfigDict(from_attributes=True)