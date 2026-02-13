from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY 
from app.db.base import Base
from typing import List


# Модель Вакансии
class Vacancy(Base):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    required_experience: Mapped[int] = mapped_column(Integer)
    required_education: Mapped[str] = mapped_column(String(50))
    required_skills: Mapped[List[str]] = mapped_column(ARRAY(String))
    min_resume_score: Mapped[int] = mapped_column(Integer)
    min_interview_score: Mapped[int] = mapped_column(Integer)
    min_tests_score: Mapped[int] = mapped_column(Integer)
    salary_offer: Mapped[int] = mapped_column(Integer)
    min_recomendation_score: Mapped[int] = mapped_column(Integer)