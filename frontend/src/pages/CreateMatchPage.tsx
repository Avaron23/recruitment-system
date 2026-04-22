import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Form, Select, Button, message, Space, Tag, Divider } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { matchesApi } from '../api/matches';
import { candidatesApi } from '../api/candidates';
import { vacanciesApi } from '../api/vacancies';
import type { MatchCreate } from '../types/match';

const educationLabels: Record<string, string> = {
  higher_profile: 'Высшее профильное',
  higher_other: 'Высшее непрофильное',
  secondary: 'Среднее',
};

export default function CreateMatchPage() {
  const [form] = Form.useForm<MatchCreate>();
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);

  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.getAll,
  });

  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ['vacancies'],
    queryFn: vacanciesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: matchesApi.create,
    onSuccess: () => {
      message.success('Мэтч создан!');
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      form.resetFields();
      setSelectedCandidate(null);
      setSelectedVacancy(null);
    },
    onError: () => message.error('Ошибка при создании мэтча'),
  });

  const handleSubmit = (values: MatchCreate) => {
    createMutation.mutate(values);
  };

  const candidate = candidates?.find(c => c.id === selectedCandidate);
  const vacancy = vacancies?.find(v => v.id === selectedVacancy);

  const candidateOptions = candidates?.map(c => ({
    value: c.id,
    label: (
      <Space>
        <Tag color="blue">{c.name}</Tag>
        <span style={{ color: '#888' }}>{c.experience} лет, {c.desired_salary.toLocaleString()} ₽</span>
      </Space>
    ),
  })) || [];

  const vacancyOptions = vacancies?.map(v => ({
    value: v.id,
    label: (
      <Space>
        <Tag color="purple">{v.title}</Tag>
        <span style={{ color: '#888' }}>{v.company}, {v.salary_offer.toLocaleString()} ₽</span>
      </Space>
    ),
  })) || [];

  return (
    <div>
      <h1>Создать мэтч</h1>
      
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            name="candidate_id" 
            label="Кандидат" 
            rules={[{ required: true, message: 'Выберите кандидата' }]}
          >
            <Select
              showSearch
              placeholder="Выберите кандидата"
              options={candidateOptions}
              loading={candidatesLoading}
              onChange={setSelectedCandidate}
              filterOption={(input, option) => 
                (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item 
            name="vacancy_id" 
            label="Вакансия" 
            rules={[{ required: true, message: 'Выберите вакансию' }]}
          >
            <Select
              showSearch
              placeholder="Выберите вакансию"
              options={vacancyOptions}
              loading={vacanciesLoading}
              onChange={setSelectedVacancy}
              filterOption={(input, option) => 
                (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {candidate && vacancy && (
            <>
              <Divider>Предпросмотр</Divider>
              <Card size="small" style={{ background: '#f5f5f5' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <strong>Кандидат:</strong> {candidate.name}
                  </div>
                  <div>
                    <strong>Опыт:</strong> {candidate.experience} лет
                  </div>
                  <div>
                    <strong>Навыки:</strong> {candidate.skills.join(', ')}
                  </div>
                  <div>
                    <strong>Образование:</strong> {educationLabels[candidate.education]}
                  </div>
                  <div>
                    <strong>Зарплата:</strong> {candidate.desired_salary.toLocaleString()} ₽
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <strong>Вакансия:</strong> {vacancy.title} в {vacancy.company}
                  </div>
                  <div>
                    <strong>Требуемый опыт:</strong> {vacancy.required_experience} лет
                  </div>
                  <div>
                    <strong>Требуемые навыки:</strong> {vacancy.required_skills.join(', ')}
                  </div>
                  <div>
                    <strong>Зарплата:</strong> {vacancy.salary_offer.toLocaleString()} ₽
                  </div>
                </Space>
              </Card>
            </>
          )}

          <Form.Item style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={createMutation.isPending}
              icon={<ThunderboltOutlined />}
              block
              disabled={!selectedCandidate || !selectedVacancy}
            >
              Создать мэтч
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}