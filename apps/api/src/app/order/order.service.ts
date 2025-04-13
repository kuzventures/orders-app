import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from '@orders-app/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeoLocationService } from '../common/geolocation/geolocation.service';


@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private eventEmitter: EventEmitter2,
    private geoLocationService: GeoLocationService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const totalAmount = createOrderDto.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      
      // Get coordinates for the delivery address
      const location = await this.geoLocationService.getCoordinatesFromAddress(
        createOrderDto.deliveryAddress
      );

      const newOrder = new this.orderModel({
        ...createOrderDto,
        totalAmount,
        status: OrderStatus.RECEIVED,
        location,
      });

      const savedOrder = await newOrder.save();
      
      this.eventEmitter.emit('order.created', savedOrder);
      
      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findPending(): Promise<Order[]> {
    return this.orderModel
      .find({ status: { $ne: OrderStatus.DELIVERED } })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(dto: UpdateOrderStatusDto): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(
      dto.orderId,
      { status: dto.status },
      { new: true },
    );
  }
}
