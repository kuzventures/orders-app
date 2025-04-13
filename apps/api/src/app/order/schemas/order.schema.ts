import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  OrderProduct,
  GeoLocation,
  Address,
  OrderStatus,
} from '@orders-app/types'; 

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    type: [Object],
  })
  products: OrderProduct[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    required: true,
    enum: Object.values(OrderStatus),
  })
  status: OrderStatus;

  @Prop({
    required: true,
    type: Object,
  })
  deliveryAddress: Address;

  @Prop({
    required: true,
    type: Object,
  })
  location: GeoLocation;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
