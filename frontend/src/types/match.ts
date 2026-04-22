export interface Match {
  id: number;
  candidate_id: number;
  vacancy_id: number;
  score: number;
  matched_skills: string[];
}

export interface MatchCreate {
  candidate_id: number;
  vacancy_id: number;
}