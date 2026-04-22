export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  education: 'higher_profile' | 'higher_other' | 'secondary';
  desired_salary: number;
  can_relocate: boolean;
}

export interface CandidateCreate {
  name: string;
  email: string;
  phone: string;
  experience: number;
  skills: string[];
  education: 'higher_profile' | 'higher_other' | 'secondary';
  desired_salary: number;
  can_relocate: boolean;
}