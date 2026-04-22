import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { vacanciesApi } from '../api/vacancies';
import type { Vacancy, VacancyCreate } from '../types/vacancy';

export default function VacanciesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<VacancyCreate>();
  const queryClient = useQueryClient();

  const { data: vacancies, isLoading } = useQuery({
    queryKey: ['vacancies'],
    queryFn: vacanciesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: vacanciesApi.create,
    onSuccess: () => {
      message.success('Вакансия добавлена');
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error('Ошибка при добавлении'),
  });

  const handleSubmit = (values: VacancyCreate) => {
    createMutation.mutate(values);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Название',
      dataIndex: 'title',
      sorter: (a: Vacancy, b: Vacancy) => a.title.localeCompare(b.title),
    },
    {
      title: 'Компания',
      dataIndex: 'company',
      sorter: (a: Vacancy, b: Vacancy) => a.company.localeCompare(b.company),
    },
    {
      title: 'Требуемый опыт (лет)',
      dataIndex: 'required_experience',
      sorter: (a: Vacancy, b: Vacancy) => a.required_experience - b.required_experience,
    },
    {
      title: 'Требуемые навыки',
      dataIndex: 'required_skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.map(skill => (
            <Tag key={skill} color="purple">{skill}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Зарплата',
      dataIndex: 'salary_offer',
      render: (salary: number) => `${salary.toLocaleString()} ₽`,
      sorter: (a: Vacancy, b: Vacancy) => a.salary_offer - b.salary_offer,
    },
    {
      title: 'Переезд',
      dataIndex: 'relocation_required',
      render: (required: boolean) => required ? <Tag color="orange">Требуется</Tag> : <Tag>Не требуется</Tag>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Вакансии</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить вакансию
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={vacancies}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Добавить вакансию"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Python разработчик" />
          </Form.Item>
          <Form.Item name="company" label="Компания" rules={[{ required: true, message: 'Введите компанию' }]}>
            <Input placeholder="Яндекс" />
          </Form.Item>
          <Form.Item name="required_experience" label="Требуемый опыт (лет)" rules={[{ required: true, message: 'Введите опыт' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="required_skills" label="Требуемые навыки (через запятую)" rules={[{ required: true, message: 'Введите навыки' }]}>
            <Input placeholder="Python, FastAPI, PostgreSQL" onChange={e => {
              const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              form.setFieldValue('required_skills', skills);
            }} />
          </Form.Item>
          <Form.Item name="salary_offer" label="Зарплата (₽)" rules={[{ required: true, message: 'Введите зарплату' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="relocation_required" label="Требуется переезд" valuePropName="checked">
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