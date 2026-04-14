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