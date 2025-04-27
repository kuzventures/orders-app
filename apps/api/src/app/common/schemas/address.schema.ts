import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address as AddressInterface } from '@orders-app/types';
import { GeoLocation, GeoLocationSchema } from '../geolocation/schemas/geo-location.schema';

@Schema({ _id: false }) // No need for IDs on subdocuments
export class Address implements AddressInterface {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  country: string;
  
  @Prop({ type: GeoLocationSchema, required: true })
  geoLocation: GeoLocation;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
