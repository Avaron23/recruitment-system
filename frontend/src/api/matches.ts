import api from './client';
import type { Match, MatchCreate } from '../types/match';

export const matchesApi = {
  getAll: () => api.get<Match[]>('/matches').then(res => res.data),
  create: (data: MatchCreate) => api.post<Match>('/matches', data).then(res => res.data),
};