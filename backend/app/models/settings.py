from sqlalchemy import Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


# Модель настроек
class AppSettings(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    w_experience: Mapped[float] = mapped_column(Float, default=0.25)
    w_skills_required: Mapped[float] = mapped_column(Float, default=0.45)
    w_education: Mapped[float] = mapped_column(Float, default=0.15)
    w_salary: Mapped[float] = mapped_column(Float, default=0.10)
    w_relocation: Mapped[float] = mapped_column(Float, default=0.05)
    threshold: Mapped[int] = mapped_column(Integer, default=70)