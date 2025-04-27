import React from 'react';
import {
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Descriptions,
  Badge,
  Divider,
} from 'antd';
import { Order, OrderStatus, OrderProduct } from '@orders-app/types';
import { updateOrderStatus } from './orders-api';

const { Title, Text } = Typography;

interface OrderItemProps {
  order: Order;
  onStatusUpdate: (updatedOrder: Order) => void;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.RECEIVED:
      return 'blue';
    case OrderStatus.PREPARING:
      return 'orange';
    case OrderStatus.READY:
      return 'geekblue';
    case OrderStatus.EN_ROUTE:
      return 'purple';
    case OrderStatus.DELIVERED:
      return 'green';
    default:
      return 'default';
  }
};

const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  switch (currentStatus) {
    case OrderStatus.RECEIVED:
      return OrderStatus.PREPARING;
    case OrderStatus.PREPARING:
      return OrderStatus.READY;
    case OrderStatus.READY:
      return OrderStatus.EN_ROUTE;
    case OrderStatus.EN_ROUTE:
      return OrderStatus.DELIVERED;
    case OrderStatus.DELIVERED:
      return null;
    default:
      return null;
  }
};

const OrderItem: React.FC<OrderItemProps> = ({ order, onStatusUpdate }) => {
  const handleUpdateStatus = async () => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      const updatedOrder = await updateOrderStatus(order.id, nextStatus);
      onStatusUpdate(updatedOrder);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <Space>
          <Badge status="processing" />
          <span>Order ID: {order.id}</span>
          <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
        </Space>
      }
      extra={
        getNextStatus(order.status) ? (
          <Button type="primary" onClick={handleUpdateStatus}>
            Move to {getNextStatus(order.status)}
          </Button>
        ) : null
      }
    >
      <Descriptions column={2} size="small">
        <Descriptions.Item label="Total Amount">
          ${order.totalAmount.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Order Time">
          {formatDate(order.createdAt.toString())}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
          {order.deliveryAddress.zipCode}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Items</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {order.products.map((product: OrderProduct, index: number) => (
          <div
            key={index}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Text>
              {product.quantity}x {product.name}
            </Text>
            <Text>${(product.price * product.quantity).toFixed(2)}</Text>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default OrderItem;
