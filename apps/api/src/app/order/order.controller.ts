import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Res,
    Query
  } from '@nestjs/common';
  import { Response } from 'express';
  import { OrderService } from './order.service';
  import { CreateOrderDto, UpdateOrderStatusDto } from '@orders-app/types';
  import { BaseController } from '../common/base/base.controller';
  
  @Controller('orders')
  export class OrderController extends BaseController {
    constructor(private readonly orderService: OrderService) {
      super();
    }
  
    @Post()
    async create(@Body() dto: CreateOrderDto, @Res() res: Response) {
      try {
        const order = await this.orderService.create(dto);
        return this.handleOkRequest(res, order);
      } catch (error) {
        this.logger.error('Create Order Failed', error.stack || error);
        return this.handleBadRequest(res, 'Failed to create order');
      }
    }
  
    @Get()
    async findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Res() res: Response
    ) {
      try {
        const { orders, total } = await this.orderService.findAll(+page, +limit);
        return this.handleOkRequest(res, { orders, total, page: +page, limit: +limit });
      } catch (error) {
        this.logger.error('Fetch Orders Failed', error.stack || error);
        return this.handleServerError(res, error.message);
      }
    }
  
    @Get('active')
    async findActive(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Res() res: Response
    ) {
      try {
        const { orders, total } = await this.orderService.findActive(+page, +limit);
        return this.handleOkRequest(res, { orders, total, page: +page, limit: +limit });
      } catch (error) {
        this.logger.error('Fetch Active Orders Failed', error.stack || error);
        return this.handleServerError(res, error.message);
      }
    }
  
    @Patch()
    async updateStatus(
      @Body() dto: UpdateOrderStatusDto,
      @Res() res: Response,
    ) {
      try {
        const updated = await this.orderService.updateStatus(dto);
        if (!updated) {
          this.logger.warn(`Order not found for ID: ${dto.orderId}`);
          return this.handleBadRequest(res, 'Order not found');
        }
        return this.handleOkRequest(res, updated);
      } catch (error) {
        this.logger.error('Update Order Status Failed', error.stack || error);
        return this.handleBadRequest(res, 'Failed to update order status');
      }
    }
  }
  