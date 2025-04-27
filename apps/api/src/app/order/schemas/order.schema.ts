import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus, Order as OrderInterface } from '@orders-app/types';
import { BaseDocument } from '../../common/base/base.schema';
import { Address, AddressSchema } from '../../common/schemas/address.schema';
import { OrderProduct, OrderProductSchema } from './order-product.schema';

export type OrderDocument = OrderInterface & Document & BaseDocument;

@Schema({ versionKey: false, timestamps: true })
export class Order extends BaseDocument {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [OrderProductSchema], required: true })
  products: OrderProduct[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.RECEIVED,
  })
  status: OrderStatus;

  @Prop({ type: AddressSchema, required: true })
  deliveryAddress: Address;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add virtual for id
OrderSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtuals are included when converting to JSON
OrderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});
