import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Space, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, BankOutlined, TrophyOutlined } from '@ant-design/icons';
import { matchesApi } from '../api/matches';
import { candidatesApi } from '../api/candidates';
import { vacanciesApi } from '../api/vacancies';
import type { Match } from '../types/match';

export default function MatchesPage() {
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getAll,
  });

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.getAll,
  });

  const { data: vacancies } = useQuery({
    queryKey: ['vacancies'],
    queryFn: vacanciesApi.getAll,
  });

  const getCandidateName = (id: number) => candidates?.find(c => c.id === id)?.name || `ID: ${id}`;
  const getVacancyTitle = (id: number) => vacancies?.find(v => v.id === id)?.title || `ID: ${id}`;
  const getCompany = (id: number) => vacancies?.find(v => v.id === id)?.company || '';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Кандидат',
      dataIndex: 'candidate_id',
      render: (id: number) => <Tag color="blue">{getCandidateName(id)}</Tag>,
    },
    {
      title: 'Вакансия',
      dataIndex: 'vacancy_id',
      render: (id: number) => (
        <Space direction="vertical" size={0}>
          <Tag color="purple">{getVacancyTitle(id)}</Tag>
          <span style={{ fontSize: 12, color: '#888' }}>{getCompany(id)}</span>
        </Space>
      ),
    },
    {
      title: 'Совпадение',
      dataIndex: 'score',
      render: (score: number) => (
        <Tag color={getScoreColor(score)} style={{ fontSize: 16, padding: '4px 12px' }}>
          {score}%
        </Tag>
      ),
      sorter: (a: Match, b: Match) => a.score - b.score,
    },
    {
      title: 'Совпавшие навыки',
      dataIndex: 'matched_skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.length > 0 ? skills.map(skill => (
            <Tag key={skill} color="green">{skill}</Tag>
          )) : <Tag>Нет совпадений</Tag>}
        </Space>
      ),
    },
  ];

  const avgScore = matches?.length 
    ? Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length)
    : 0;

  return (
    <div>
      <h1>Мэтчи</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Всего мэтчей" 
              value={matches?.length || 0} 
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Кандидатов" 
              value={candidates?.length || 0} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Вакансий" 
              value={vacancies?.length || 0} 
              prefix={<BankOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Средний балл" 
              value={avgScore} 
              suffix="%"
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Таблица мэтчей">
        <Table
          columns={columns}
          dataSource={matches}
          loading={matchesLoading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}