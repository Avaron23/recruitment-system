from app.models.candidate import Candidate
from app.models.vacancy import Vacancy


class MatchAlgorithm:

    @staticmethod
    def calculate_match(candidate: Candidate, vacancy: Vacancy) -> dict:

        # Сюда будем суммировать все балы   
        total_score = 0

        # 1. Опыт 0.30
        if vacancy.required_experience == 0:
            total_score += 0.30
        else:
            exp_score = min(candidate.experience / vacancy.required_experience, 1.0)
            total_score += exp_score * 0.30

        # 2. Обязательные навыки (совпадение) 0.25
        if vacancy.required_skills:
            matched_skills = set(candidate.skills) & set(vacancy.required_skills)
            skills_score = len(matched_skills) / len(vacancy.required_skills)
            total_score += skills_score * 0.25
        else:
            total_score += 0.25
            matched_skills = set()

        # 3. Желательные навыки (совпадение) 0.10
        if vacancy.preferred_skills:
            matched_preferred_skills = set(candidate.skills) & set(vacancy.preferred_skills)
            preferred_skills = len(matched_preferred_skills) / len(vacancy.preferred_skills)
            total_score += skills_score * 0.10
        else:
            total_score += 0.10
            matched_skills = set()
        matched_skills |= matched_preferred_skills

        # 4. Образование 0.15
        edu_map = {
            "Высшее профильное": 1.0, 
            "Среднее профильное": 0.8,
            "Высшее непрофильное": 0.6,
            "Среднее непрофильное": 0.4,
            "Без образования": 0.2
        }
        if edu_map[vacancy.required_education] <= edu_map[candidate.education]:
            total_score += 0.15
        else:
            total_score += edu_map[candidate.education] * 0.15

        # 5. Зарплата 0.10
        if candidate.desired_salary <= vacancy.salary_offer:
            salary_score = 1.0
        else:
            salary_score = vacancy.salary_offer / candidate.desired_salary
        total_score += salary_score * 0.10

        # 6. Переезд 0.10
        if vacancy.relocation_required:
            relocation_score = 1.0 if candidate.can_relocate else 0.0
        else:
            relocation_score = 1.0
        total_score += relocation_score * 0.10


        return{
            "total_score": int(round(total_score * 100)),
            "matched_skills": list(matched_skills)
        }