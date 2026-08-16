import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import LeadsPage from './pages/LeadsPage';
import CreateLeadPage from './pages/CreateLeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import EditLeadPage from './pages/EditLeadPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

function AppNav() {
  const location = useLocation();
  const selectedKey = location.pathname === '/' ? '/' : '';

  return (
    <Header className="app-header">
      <div className="app-logo">
        <TeamOutlined style={{ fontSize: 20, marginRight: 8 }} />
        <Text strong style={{ color: '#fff', fontSize: 16 }}>
          Leads Tracking
        </Text>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={[{ key: '/', label: <Link to="/">Leads</Link> }]}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout className="app-layout">
        <AppNav />
        <Content className="app-content">
          <div className="content-inner">
            <Routes>
              <Route path="/" element={<LeadsPage />} />
              <Route path="/leads/new" element={<CreateLeadPage />} />
              <Route path="/leads/:id" element={<LeadDetailsPage />} />
              <Route path="/leads/:id/edit" element={<EditLeadPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#888' }}>
          Leads Tracking App
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
