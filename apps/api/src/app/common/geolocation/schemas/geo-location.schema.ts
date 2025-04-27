import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GeoLocation as GeoLocationInterface } from '@orders-app/types';

@Schema({ _id: false }) // No need for IDs on subdocuments
export class GeoLocation implements GeoLocationInterface {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);
