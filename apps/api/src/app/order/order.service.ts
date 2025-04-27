import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import {
  CreateOrderDto,
  OrderStatus,
  UpdateOrderStatusDto,
} from '@orders-app/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeoLocationService } from '../common/geolocation/geolocation.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private eventEmitter: EventEmitter2,
    private geoLocationService: GeoLocationService,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    filters = {},
  ): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = this.orderModel.find(filters);
    const total = await this.orderModel.countDocuments(filters);

    const orders = await query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { orders, total };
  }

  async findActive(
    page = 1,
    limit = 10,
  ): Promise<{ orders: OrderDocument[]; total: number }> {
    const filters = { status: { $ne: OrderStatus.DELIVERED } };
    return this.findAll(page, limit, filters);
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    try {
      const productIds = createOrderDto.products.map(item => item.productId);
      
      const products = await this.productModel.find({
        _id: { $in: productIds }
      }).exec();
      
      // Create a map for quick product lookup
      const productMap = new Map();
      products.forEach(product => {
        productMap.set(product._id.toString(), product);
      });
      
      // Calculate total amount and enhance products with complete details
      let totalAmount = 0;
      const enhancedProducts = [];
      
      for (const item of createOrderDto.products) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        enhancedProducts.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          description: product.description,
          type: product.type
        });
      }
      
      // Get coordinates for the delivery address
      const geoLocation = await this.geoLocationService.getCoordinatesFromAddress(
        createOrderDto.deliveryAddress
      );
      
      // Create new order with the enhanced product details
      const newOrder = new this.orderModel({
        userId: createOrderDto.userId,
        products: enhancedProducts,
        totalAmount,
        status: OrderStatus.RECEIVED,
        deliveryAddress: {
          ...createOrderDto.deliveryAddress,
          geoLocation
        },
        orderNumber: `#${Math.floor(1000 + Math.random() * 9000)}`
      });

      const savedOrder = await newOrder.save();
      
      // Emit event for real-time updates
      this.eventEmitter.emit('order.created', savedOrder);
      
      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateStatus(dto: UpdateOrderStatusDto): Promise<OrderDocument | null> {
    try {
      const order = await this.orderModel.findById(dto.orderId);

      if (!order) {
        return null;
      }

      order.status = dto.status;
      const updatedOrder = await order.save();

      // Emit event for real-time updates
      this.eventEmitter.emit('order.updated', updatedOrder);

      return updatedOrder;
    } catch (error) {
      this.logger.error(
        `Error updating order status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
