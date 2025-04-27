import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductType } from '@orders-app/types';

@Schema({ _id: false }) // Don't generate separate IDs for embedded documents
export class OrderProduct {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;
  
  @Prop({ required: true })
  name: string;
  
  @Prop()
  description: string;
  
  @Prop({ 
    type: String,
    enum: Object.values(ProductType),
    required: true 
  })
  type: ProductType;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);