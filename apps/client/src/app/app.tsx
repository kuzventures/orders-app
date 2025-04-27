import React from 'react';
import { Layout, Typography } from 'antd';
import OrdersDashboard from './orders/orders-dashboard';

import styles from './app.module.scss';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export function App() {
  return (
    <Layout className={styles.appLayout}>
      <Header className={styles.appHeader}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Pizza Order Management System
        </Title>
      </Header>
      <Content className={styles.appContent}>
        <OrdersDashboard />
      </Content>
      <Footer className={styles.appFooter}>
        Pizza Order Management By V ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;