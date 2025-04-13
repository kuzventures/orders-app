export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    type: ProductType;
  }
  
  export enum ProductType {
    PIZZA = 'Pizza',
    SALAD = 'Salad',
    DESSERT = 'Dessert',
    BEVERAGE = 'Beverage',
  }
  
  export interface OrderProduct {
    productId: string;
    quantity: number;
    price: number;
  }