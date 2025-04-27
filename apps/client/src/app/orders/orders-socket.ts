import { io, Socket } from 'socket.io-client';
import { Order } from '@orders-app/types';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000';

class OrdersSocket {
  private socket: Socket | null = null;
  private orderCreatedListeners: ((order: Order) => void)[] = [];
  private orderUpdatedListeners: ((order: Order) => void)[] = [];
  
  constructor() {
    this.initializeSocket();
  }
  
  private initializeSocket() {
    if (this.socket) return;
    
    this.socket = io(WEBSOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Socket connected to orders server');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected from orders server');
    });
    
    this.socket.on('orderCreated', (order: Order) => {
      this.orderCreatedListeners.forEach(listener => listener(order));
    });
    
    this.socket.on('orderUpdated', (order: Order) => {
      this.orderUpdatedListeners.forEach(listener => listener(order));
    });
  }
  
  public onOrderCreated(callback: (order: Order) => void) {
    this.orderCreatedListeners.push(callback);
  }
  
  public onOrderUpdated(callback: (order: Order) => void) {
    this.orderUpdatedListeners.push(callback);
  }
  
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const ordersSocket = new OrdersSocket();