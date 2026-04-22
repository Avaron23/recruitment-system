import api from './client';
import type { Candidate, CandidateCreate } from '../types/candidate';

export const candidatesApi = {
  getAll: () => api.get<Candidate[]>('/candidates').then(res => res.data),
  getById: (id: number) => api.get<Candidate>(`/candidates/${id}`).then(res => res.data),
  create: (data: CandidateCreate) => api.post<Candidate>('/candidates', data).then(res => res.data),
};