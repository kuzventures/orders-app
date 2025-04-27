import { OrderProduct } from '../product';
import { Address } from '../user';
import { BaseIdentifiers } from '../common';

export enum OrderStatus {
    RECEIVED = 'Received',
    PREPARING = 'Preparing',
    READY = 'Ready',
    EN_ROUTE = 'EnRoute',
    DELIVERED = 'Delivered',
  }

  export interface Order extends BaseIdentifiers {
    id: string;
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
    status: OrderStatus;
    deliveryAddress: Address;
    }

  export interface CreateOrderDto {
    userId: string;
    products: OrderProduct[];
    deliveryAddress: Address;
  }

  export interface UpdateOrderStatusDto {
    orderId: number;
    status: OrderStatus;
  }

  export interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }