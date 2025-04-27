import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { Order, OrderSchema } from '../../order/schemas/order.schema';
import { Product, ProductSchema } from '../../product/schemas/product.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  providers: [SeederService],
  exports: [SeederService]
})
export class SeederModule {}
