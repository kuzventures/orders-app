// apps/api/src/app/common/schemas/base.schema.ts
import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseIdentifiers } from '@orders-app/types';

export abstract class BaseDocument extends Document implements BaseIdentifiers {
  _id: string;
  
  @Prop({ type: Date })
  createdAt: string;
  
  @Prop({ type: Date })
  updatedAt: string;
  
  // Virtual getter for id
  id: string;
}