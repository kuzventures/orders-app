import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, User as UserInterface } from '@orders-app/types';
import { BaseDocument } from '../../common/base/base.schema';
import { Address, AddressSchema } from '../../common/schemas/address.schema';

export type UserDocument = UserInterface & Document & BaseDocument;

@Schema({ versionKey: false, timestamps: true })
export class User extends BaseDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual for id
UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.password; // Remove sensitive data if present
    return ret;
  }
});
