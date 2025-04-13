import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, Address, GeoLocation } from '@orders-app/types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Object, required: true })
  address: Address;

  @Prop({ type: Object })
  location?: GeoLocation;

  @Prop({ 
    type: String, 
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
