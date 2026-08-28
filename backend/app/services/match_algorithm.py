from app.models.candidate import Candidate
from app.models.vacancy import Vacancy
from app.models.settings import AppSettings


class MatchAlgorithm:

    @staticmethod
    def calculate_match(candidate: Candidate, vacancy: Vacancy, settings: AppSettings) -> dict:

        edu_map = {
            "Высшее профильное": 1.0,
            "Среднее профильное": 0.8,
            "Высшее непрофильное": 0.6,
            "Среднее непрофильное": 0.4,
            "Без образования": 0.2
        }

        # Проверка на обязательные требования
        # 1. Обязательный опыт
        if vacancy.is_experience_mandatory:
            if candidate.experience < vacancy.required_experience:
                return {
                    "total_score": 0,
                    "matched_skills": []
                }
        
        # 2. Обязательное образование
        if vacancy.is_education_mandatory:
            # Сравниваешь уровни образования
            if edu_map[candidate.education] < edu_map[vacancy.required_education]:
                return {
                    "total_score": 0,
                    "matched_skills": []
                }
        
        # 3. Обязательный переезд
        if vacancy.is_relocation_mandatory and vacancy.relocation_required:
            if not candidate.can_relocate:
                return {
                    "total_score": 0,
                    "matched_skills": []
                }
        
        # 4. Обязательная зарплата
        if vacancy.is_salary_mandatory:
            if candidate.desired_salary > vacancy.salary_offer:
                return {
                    "total_score": 0,
                    "matched_skills": []
                }

        total_score = 0

        # 1. Опыт (default = 0.30) settings.w_experience
        if vacancy.required_experience == 0:
            total_score += settings.w_experience
        else:
            exp_score = min(candidate.experience / vacancy.required_experience, 1.0)
            total_score += exp_score * settings.w_experience

        # 2. Обязательные навыки (default = 0.25) settings.w_skills_required
        matched_required = set()
        if vacancy.required_skills:
            matched_required = set(candidate.skills) & set(vacancy.required_skills)
            # Если не все обязательные навыки есть — сразу не прошёл
            if len(matched_required) < len(vacancy.required_skills):
                return {
                    "total_score": 0,
                    "matched_skills": []
                }
            total_score += settings.w_skills_required
        else:
            total_score += settings.w_skills_required

        # 3. Желательные навыки (default = 0.10) settings.w_skills_preferred
        matched_preferred = set()
        if vacancy.preferred_skills:
            matched_preferred = set(candidate.skills) & set(vacancy.preferred_skills)
            preferred_score = len(matched_preferred) / len(vacancy.preferred_skills)
            total_score += preferred_score * settings.w_skills_preferred
        else:
            total_score += settings.w_skills_preferred

        # Все совпавшие навыки
        matched_skills = matched_required | matched_preferred

        # 4. Образование (default = 0.15) settings.w_education
        if edu_map[vacancy.required_education] <= edu_map[candidate.education]:
            total_score += settings.w_education
        else:
            total_score += edu_map[candidate.education] * settings.w_education

        # 5. Зарплата (default = 0.10) settings.w_salary
        if candidate.desired_salary <= vacancy.salary_offer:
            total_score += settings.w_salary
        else:
            total_score += (vacancy.salary_offer / candidate.desired_salary) * settings.w_salary

        # 6. Переезд (default = 0.10) settings.w_relocation
        if vacancy.relocation_required:
            total_score += settings.w_relocation if candidate.can_relocate else 0.0
        else:
            total_score += settings.w_relocation

        return {
            "total_score": int(round(total_score * 100)),
            "matched_skills": list(matched_skills)
        }