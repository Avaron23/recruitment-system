import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import AppLayout from './layouts/AppLayout';
import CandidatesPage from './pages/CandidatesPage';
import VacanciesPage from './pages/VacanciesPage';
import MatchesPage from './pages/MatchesPage';
import CreateMatchPage from './pages/CreateMatchPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/candidates" replace />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="vacancies" element={<VacanciesPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="create-match" element={<CreateMatchPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
