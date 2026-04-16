from app.models.candidate import Candidate
from app.models.vacancy import Vacancy


class MatchAlgorithm:

    @staticmethod
    def calculate_match(candidate: Candidate, vacancy: Vacancy) -> dict:
        
        # Находим совпавшие навыки
        matched_skills = set(candidate.skills) & set(vacancy.required_skills)

        # Логика скоринга 
        total_score = (0)
        