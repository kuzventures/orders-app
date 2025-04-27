import React, { useState, useMemo } from 'react';
import { List, Empty, Select, Space, Typography, Pagination, Card } from 'antd';
import { Order, OrderStatus } from '@orders-app/types';
import OrderItem from './order-item';

const { Option } = Select;
const { Title } = Typography;

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
  onStatusUpdate: (updatedOrder: Order) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ 
  orders, 
  loading, 
  onStatusUpdate,
  pagination,
  onPageChange
}) => {
  const [filteredStatus, setFilteredStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = useMemo(() => {
    return orders?.filter(order => {
        // Filter by status
        if (filteredStatus !== 'ALL' && order.status !== filteredStatus) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected field
        if (sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'totalAmount') {
          return sortDirection === 'asc' 
            ? a.totalAmount - b.totalAmount 
            : b.totalAmount - a.totalAmount;
        } else if (sortBy === 'status') {
          // Convert status to numeric value for sorting
          const statusOrder = {
            [OrderStatus.RECEIVED]: 1,
            [OrderStatus.PREPARING]: 2,
            [OrderStatus.READY]: 3,
            [OrderStatus.EN_ROUTE]: 4,
            [OrderStatus.DELIVERED]: 5,
          };
          
          const statusA = statusOrder[a.status];
          const statusB = statusOrder[b.status];
          
          return sortDirection === 'asc' 
            ? statusA - statusB 
            : statusB - statusA;
        }
        return 0;
      });
  }, [orders, filteredStatus, sortBy, sortDirection]);

  const showingFilteredResults = filteredStatus !== 'ALL';

  return (
    <Card>
      <Title level={3}>Orders</Title>
      
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Select 
            style={{ width: 140 }} 
            defaultValue="ALL" 
            onChange={(value) => setFilteredStatus(value as OrderStatus | 'ALL')}
          >
            <Option value="ALL">All Statuses</Option>
            {Object.values(OrderStatus).map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
          
          <Select 
            style={{ width: 160 }} 
            defaultValue="createdAt" 
            onChange={(value) => setSortBy(value)}
          >
            <Option value="createdAt">Order Time</Option>
            <Option value="totalAmount">Total Amount</Option>
            <Option value="status">Status</Option>
          </Select>
          
          <Select 
            style={{ width: 120 }} 
            defaultValue="desc" 
            onChange={(value) => setSortDirection(value as 'asc' | 'desc')}
          >
            <Option value="desc">Newest First</Option>
            <Option value="asc">Oldest First</Option>
          </Select>
        </Space>
      </Space>

      {filteredOrders?.length > 0 ? (
        <>
          <List
            dataSource={filteredOrders}
            loading={loading}
            renderItem={order => (
              <List.Item key={order.id}>
                <OrderItem order={order} onStatusUpdate={onStatusUpdate} />
              </List.Item>
            )}
            pagination={false}
          />
          
          {!showingFilteredResults && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
                showSizeChanger
                pageSizeOptions={['5', '10', '20', '50']}
                showQuickJumper
                showTotal={(total) => `Total ${total} orders`}
              />
            </div>
          )}
        </>
      ) : (
        <Empty 
          description={
            showingFilteredResults 
              ? "No orders match your filters" 
              : "No orders found"
          } 
        />
      )}
    </Card>
  );
};

export default OrdersList;