import { OrderProduct } from '../product';
import { Address } from '../user';
import { GeoLocation } from '../common';

export enum OrderStatus {
    RECEIVED = 'Received',
    PREPARING = 'Preparing',
    READY = 'Ready',
    EN_ROUTE = 'EnRoute',
    DELIVERED = 'Delivered',
  }

  export interface Order {
    id: string;
    userId: string;
    products: OrderProduct[];
    totalAmount: number;
    status: OrderStatus;
    deliveryAddress: Address;
    location: GeoLocation;
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