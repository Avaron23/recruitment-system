export interface Vacancy {
  id: number;
  title: string;
  company: string;
  required_experience: number;
  required_skills: string[];
  salary_offer: number;
  relocation_required: boolean;
}

export interface VacancyCreate {
  title: string;
  company: string;
  required_experience: number;
  required_skills: string[];
  salary_offer: number;
  relocation_required: boolean;
}