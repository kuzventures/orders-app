import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Product as ProductInterface } from '@orders-app/types';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: Partial<ProductInterface>): Promise<ProductDocument> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return await newProduct.save();
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateProductDto: Partial<ProductInterface>): Promise<ProductDocument> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();
        
      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Error updating product ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}