from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY 
from app.db.base import Base
from typing import List


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    experience: Mapped[int] = mapped_column(Integer)
    education: Mapped[str] = mapped_column(String(50))
    skills: Mapped[List[str]] = mapped_column(ARRAY(String))
    resume_score: Mapped[int] = mapped_column(Integer)
    interview_score: Mapped[int] = mapped_column(Integer)
    tests_score: Mapped[int] = mapped_column(Integer)
    desired_salary: Mapped[int] = mapped_column(Integer)
    recomendation_score: Mapped[int] = mapped_column(Integer)
    #created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False)  