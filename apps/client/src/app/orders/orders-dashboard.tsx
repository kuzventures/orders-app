import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout, Typography, Spin, Alert, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fetchActiveOrders } from './orders-api';
import OrdersList from './orders-list';
import { Order, OrderStatus } from '@orders-app/types';

const { Content } = Layout;
const { Title } = Typography;

// Get polling interval from env var or use default
const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL || '10000', 10);

const OrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Statistics
  const receivedOrders = orders?.filter(order => order.status === OrderStatus.RECEIVED).length;
  const preparingOrders = orders?.filter(order => order.status === OrderStatus.PREPARING).length;
  const readyOrders = orders?.filter(order => order.status === OrderStatus.READY).length;
  const enRouteOrders = orders?.filter(order => order.status === OrderStatus.EN_ROUTE).length;

  const fetchOrders = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await fetchActiveOrders(page, pageSize);
      setOrders(response.orders);
      setPagination({
        current: response.page,
        pageSize: response.limit,
        total: response.total
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
    
    // Start polling
    startPolling();
    
    // Clean up on unmount
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [fetchOrders, pagination.current, pagination.pageSize]);

  const startPolling = () => {
    // Clear any existing timer
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
    
    // Set up new polling interval
    pollingTimerRef.current = setInterval(() => {
      fetchOrders(pagination.current, pagination.pageSize);
    }, POLLING_INTERVAL);
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination(prev => ({...prev, current: page, pageSize: newPageSize}));
    fetchOrders(page, newPageSize);
  };

  return (
    <Layout style={{ padding: '20px' }}>
      <Content>
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Received Orders" 
                value={receivedOrders} 
                prefix={<ShoppingCartOutlined />} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Preparing" 
                value={preparingOrders} 
                prefix={<ClockCircleOutlined />} 
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="Ready for Delivery" 
                value={readyOrders} 
                prefix={<CheckCircleOutlined />} 
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="En Route" 
                value={enRouteOrders} 
                prefix={<CheckCircleOutlined />} 
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
        
        {loading && orders?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Loading orders...</div>
          </div>
        ) : (
          <OrdersList 
            orders={orders} 
            loading={loading} 
            onStatusUpdate={handleOrderUpdate} 
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </Content>
    </Layout>
  );
};

export default OrdersDashboard;