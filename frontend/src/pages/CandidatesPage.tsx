import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Tag, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { candidatesApi } from '../api/candidates';
import type { Candidate, CandidateCreate } from '../types/candidate';

const educationOptions = [
  { value: 'higher_profile', label: 'Высшее профильное' },
  { value: 'higher_other', label: 'Высшее непрофильное' },
  { value: 'secondary', label: 'Среднее' },
];

const educationColors: Record<string, string> = {
  higher_profile: 'green',
  higher_other: 'blue',
  secondary: 'orange',
};

const educationLabels: Record<string, string> = {
  higher_profile: 'Высшее профильное',
  higher_other: 'Высшее непрофильное',
  secondary: 'Среднее',
};

export default function CandidatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<CandidateCreate>();
  const queryClient = useQueryClient();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: candidatesApi.create,
    onSuccess: () => {
      message.success('Кандидат добавлен');
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error('Ошибка при добавлении'),
  });

  const handleSubmit = (values: CandidateCreate) => {
    createMutation.mutate(values);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      sorter: (a: Candidate, b: Candidate) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
    },
    {
      title: 'Опыт (лет)',
      dataIndex: 'experience',
      sorter: (a: Candidate, b: Candidate) => a.experience - b.experience,
    },
    {
      title: 'Навыки',
      dataIndex: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.map(skill => (
            <Tag key={skill} color="blue">{skill}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Образование',
      dataIndex: 'education',
      render: (edu: string) => (
        <Tag color={educationColors[edu]}>{educationLabels[edu]}</Tag>
      ),
    },
    {
      title: 'Зарплата',
      dataIndex: 'desired_salary',
      render: (salary: number) => `${salary.toLocaleString()} ₽`,
      sorter: (a: Candidate, b: Candidate) => a.desired_salary - b.desired_salary,
    },
    {
      title: 'Переезд',
      dataIndex: 'can_relocate',
      render: (can: boolean) => can ? <Tag color="green">Да</Tag> : <Tag>Нет</Tag>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Кандидаты</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить кандидата
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={candidates}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Добавить кандидата"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Введите email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Телефон" rules={[{ required: true, message: 'Введите телефон' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="experience" label="Опыт (лет)" rules={[{ required: true, message: 'Введите опыт' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="skills" label="Навыки (через запятую)" rules={[{ required: true, message: 'Введите навыки' }]}>
            <Input placeholder="Python, SQL, Docker" onChange={e => {
              const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              form.setFieldValue('skills', skills);
            }} />
          </Form.Item>
          <Form.Item name="education" label="Образование" rules={[{ required: true, message: 'Выберите образование' }]}>
            <Select options={educationOptions} />
          </Form.Item>
          <Form.Item name="desired_salary" label="Желаемая зарплата (₽)" rules={[{ required: true, message: 'Введите зарплату' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="can_relocate" label="Готов к переезду" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending} block>
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}