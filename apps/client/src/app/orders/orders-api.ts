import axios from 'axios';
import { Order, OrderStatus, OrdersResponse, ApiResponse } from '@orders-app/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchOrders = async (page = 1, limit = 10): Promise<OrdersResponse> => {
  try {
    const response = await axios.get<ApiResponse<OrdersResponse>>(
      `${API_URL}/orders?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchActiveOrders = async (page = 1, limit = 10): Promise<OrdersResponse> => {
  try {
    const response = await axios.get<ApiResponse<OrdersResponse>>(
      `${API_URL}/orders/active?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching active orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  try {
    const response = await axios.patch<ApiResponse<Order>>(
      `${API_URL}/orders`, 
      { status, orderId }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating order status for order ${orderId}:`, error);
    throw error;
  }
};
