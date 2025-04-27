import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductType } from '@orders-app/types';
import { BaseDocument } from '../../common/base/base.schema';

export type ProductDocument = Product & Document & BaseDocument;

@Schema({ versionKey: false, timestamps: true })
export class Product extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  inventory: number;

  @Prop({
    type: String,
    enum: Object.values(ProductType),
    required: true,
  })
  type: ProductType;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add virtual for id
ProductSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtuals are included when converting to JSON
ProductSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  }
});
