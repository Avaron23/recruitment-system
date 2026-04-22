import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, BankOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const menuItems = [
  { key: '/candidates', icon: <UserOutlined />, label: 'Кандидаты' },
  { key: '/vacancies', icon: <BankOutlined />, label: 'Вакансии' },
  { key: '/matches', icon: <TrophyOutlined />, label: 'Мэтчи' },
  { key: '/create-match', icon: <ThunderboltOutlined />, label: 'Создать мэтч' },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginRight: 40 }}>
          Recruitment System
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, background: 'transparent' }}
        />
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: '85vh' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}