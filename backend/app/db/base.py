from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs


# Базовая модель sqlalchemy, все модели наследуются от неё
class Base(AsyncAttrs, DeclarativeBase):
    __abstract__ = True