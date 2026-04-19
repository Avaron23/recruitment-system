from app.models.candidate import Candidate
from app.models.vacancy import Vacancy


class MatchAlgorithm:

    @staticmethod
    def calculate_match(candidate: Candidate, vacancy: Vacancy) -> dict:

        # Сюда будем суммировать все балы
        total_score = 0

        # 1. Опыт 0.30
        exp_score = min(candidate.experience / vacancy.required_experience, 1.0)
        total_score += exp_score * 0.30

        # 2. Навыки (совпадение) 0.35
        if vacancy.required_skills:
            matched_skills = set(candidate.skills) & set(vacancy.required_skills)
            skills_score = len(matched_skills) / len(vacancy.required_skills)
            total_score += skills_score * 0.35
        else:
            total_score += 0.30

        # 3. Образование 0.15
        edu_map = {
            "higher_profile": 1.0, 
            "higher_other": 0.6,
            "secondary": 0.2
        }
        edu_score = edu_map.get(candidate.education, 0.0)   
        total_score += edu_score *0.15

        # 4. Зарплата 0.10
        if candidate.desired_salary <= vacancy.salary_offer:
            salary_score = 1.0
        else:
            salary_score = vacancy.salary_offer / candidate.desired_salary
        total_score += salary_score * 0.10

        # 5. Переезд 0.10
        if vacancy.relocation_required:
            relocation_score = 1.0 if candidate.can_relocate else 0.0
        else:
            relocation_score = 1.0
        total_score += relocation_score * 0.10

        return{
            "total_score": total_score,
            "matched_skills": matched_skills
        }