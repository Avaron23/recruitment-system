from pydantic import BaseModel, ConfigDict
from typing import List


class MatchCreate(BaseModel):
    candidate_id: int
    vacancy_id: int

    model_config = ConfigDict(from_attributes=True)

class MatchResponse(BaseModel):
    candidate_id: int
    vacancy_id: int
    total_score: int
    matched_skills: List[str]

    model_config = ConfigDict(from_attributes=True)

class RankedMatchResponse(BaseModel):
    candidate_id: int
    candidate_name: str
    vacancy_id: int
    total_score: int
    matched_skills: List[str]
    rank: int | None
    passed: bool

    model_config = ConfigDict(from_attributes=True)