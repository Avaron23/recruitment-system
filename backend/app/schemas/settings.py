from pydantic import BaseModel, ConfigDict


class SettingsCreate(BaseModel):
    w_experience: float
    w_skills_required: float
    w_education: float
    w_salary: float
    w_relocation: float
    threshold: int

    model_config = ConfigDict(from_attributes=True)

class SettingsResponse(BaseModel):
    id: int
    w_experience: float
    w_skills_required: float
    w_education: float
    w_salary: float
    w_relocation: float
    threshold: int

    model_config = ConfigDict(from_attributes=True)