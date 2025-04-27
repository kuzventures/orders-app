import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductType } from '@orders-app/types';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll() {
    try {
      return await this.productService.findAll();
    } catch (error) {
      this.logger.error(`Error retrieving products: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      this.logger.error(`Error retrieving product ${id}: ${error.message}`);
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: Partial<Product>) {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      this.logger.error(`Error updating product ${id}: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.productService.remove(id);
    } catch (error) {
      this.logger.error(`Error removing product ${id}: ${error.message}`);
      throw error;
    }
  }
}