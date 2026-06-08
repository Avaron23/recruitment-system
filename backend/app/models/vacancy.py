from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY 
from app.db.base import Base
from typing import List


# Модель вакансии
class Vacancy(Base):
    __tablename__ = "vacancies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    required_experience: Mapped[int] = mapped_column(Integer)
    required_education: Mapped[str] = mapped_column(String(50))
    required_skills: Mapped[List[str]] = mapped_column(ARRAY(String))
    preferred_skills: Mapped[List[str]] = mapped_column(ARRAY(String))
    salary_offer: Mapped[int] = mapped_column(Integer)
    relocation_required: Mapped[bool] = mapped_column(Boolean)
    # Флаги обязательности
    is_experience_mandatory: Mapped[bool] = mapped_column(Boolean, default=False)
    is_education_mandatory: Mapped[bool] = mapped_column(Boolean, default=False)
    is_salary_mandatory: Mapped[bool] = mapped_column(Boolean, default=False)
    is_relocation_mandatory: Mapped[bool] = mapped_column(Boolean, default=False)