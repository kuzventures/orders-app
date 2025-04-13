import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus } from '@orders-app/types';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    type: [
      {
        title: { type: String },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],
  })
  products: {
    title: string;
    price: number;
    quantity: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, enum: Object.values(OrderStatus) })
  status: OrderStatus;

  @Prop({
    required: true,
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  })
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({
    required: true,
    type: {
      lat: Number,
      lng: Number,
    },
  })
  location: {
    lat: number;
    lng: number;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
