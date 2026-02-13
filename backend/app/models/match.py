from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY 
from app.db.base import Base
from app.models.candidate import Candidate
from app.models.vacancy import Vacancy
from typing import List


# Модель результата мэтчинга
class Match(Base):
    __tablename__ = "matches" 

    candidate_id: Mapped[int] = mapped_column(ForeignKey('candidates.id', ondelete='CASCADE'), primary_key=True) 
    vacancy_id: Mapped[int] = mapped_column(ForeignKey('vacancies.id', ondelete='CASCADE'), primary_key=True)
    total_score: Mapped[int] = mapped_column(Integer)
    matched_skills: Mapped[List[str]] = mapped_column(ARRAY(String))