import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Order } from '../../order/schemas/order.schema';
import { Product } from '../../product/schemas/product.schema';
import { OrderStatus, ProductType } from '@orders-app/types';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<string>('SEED_DB') === 'true';
    
    if (shouldSeed) {
      this.logger.log('Starting database seeding...');
      
      const productCount = await this.productModel.countDocuments();
      if (productCount === 0) {
        await this.seedProducts();
      }
      
      const orderCount = await this.orderModel.countDocuments();
      if (orderCount === 0) {
        await this.seedOrders();
      }
      
      this.logger.log('Database seeding completed!');
    }
  }

  private async seedProducts() {
    this.logger.log('Seeding products...');
    
    const products = [
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 45.90,
        inventory: 100,
        type: ProductType.PIZZA
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
        price: 54.90,
        inventory: 100,
        type: ProductType.PIZZA
      },
      {
        name: 'Vegetarian Pizza',
        description: 'Pizza with tomato sauce, mozzarella, and mixed vegetables',
        price: 49.90,
        inventory: 100,
        type: ProductType.PIZZA
      },
      {
        name: 'Greek Salad',
        description: 'Fresh salad with cucumber, tomato, olives, and feta cheese',
        price: 34.90,
        inventory: 100,
        type: ProductType.SALAD
      },
      {
        name: 'Caesar Salad',
        description: 'Classic Caesar salad with croutons and parmesan',
        price: 32.90,
        inventory: 100,
        type: ProductType.SALAD
      },
      {
        name: 'Coca Cola',
        description: '500ml bottle',
        price: 12.90,
        inventory: 200,
        type: ProductType.BEVERAGE
      },
      {
        name: 'Sprite',
        description: '500ml bottle',
        price: 12.90,
        inventory: 200,
        type: ProductType.BEVERAGE
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert',
        price: 29.90,
        inventory: 50,
        type: ProductType.DESSERT
      }
    ];
    
    await this.productModel.insertMany(products);
    this.logger.log(`Added ${products.length} products`);
  }

  private async seedOrders() {
    this.logger.log('Seeding 300 orders...');
    
    // Get all products from the database
    const products = await this.productModel.find().exec();
    
    // Cities with their approximate geo coordinates
    const cities = [
      { city: 'Tel Aviv', coords: { latitude: 32.0853, longitude: 34.7818 } },
      { city: 'Jerusalem', coords: { latitude: 31.7683, longitude: 35.2137 } },
      { city: 'Haifa', coords: { latitude: 32.7940, longitude: 34.9896 } },
      { city: 'Beer Sheva', coords: { latitude: 31.2518, longitude: 34.7913 } },
      { city: 'Netanya', coords: { latitude: 32.3286, longitude: 34.8500 } },
      { city: 'Eilat', coords: { latitude: 29.5577, longitude: 34.9519 } },
      { city: 'Ashkelon', coords: { latitude: 31.6689, longitude: 34.5746 } },
      { city: 'Rishon LeZion', coords: { latitude: 31.9730, longitude: 34.7925 } },
      { city: 'Petah Tikva', coords: { latitude: 32.0866, longitude: 34.8780 } },
      { city: 'Ashdod', coords: { latitude: 31.7920, longitude: 34.6497 } }
    ];
    
    // First names
    const firstNames = [
      'Moshe', 'David', 'Yosef', 'Yakov', 'Avraham', 
      'Sara', 'Rachel', 'Leah', 'Rivka', 'Miriam',
      'Noa', 'Tamar', 'Yael', 'Shira', 'Michal',
      'Daniel', 'Itai', 'Idan', 'Noam', 'Amit',
      'Yonatan', 'Eitan', 'Ariel', 'Gal', 'Tal'
    ];
    
    // Last names
    const lastNames = [
      'Cohen', 'Levi', 'Mizrahi', 'Peretz', 'Biton',
      'Avraham', 'Friedman', 'Azulay', 'Amar', 'Dahan',
      'Katz', 'Shapiro', 'Rosenberg', 'Weiss', 'Klein',
      'Golan', 'Sharon', 'Ben-David', 'Even', 'Bar-On'
    ];
    
    // Street names
    const streetNames = [
      'Herzl', 'Ben Yehuda', 'Rothschild', 'Dizengoff', 'Allenby',
      'King George', 'Jabotinsky', 'Weizmann', 'Begin', 'Rabin',
      'Bialik', 'Tchernichovsky', 'HaNevi\'im', 'HaYarkon', 'HaShalom'
    ];
    
    // Generate 300 random orders
    const orders = [];
    
    for (let i = 0; i < 300; i++) {
      // Generate random user name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const userId = `user_${i + 1}`;
      
      // Random location in Israel
      const cityInfo = cities[Math.floor(Math.random() * cities.length)];
      
      // Add some randomness to coordinates (within ~1km)
      const latVariation = (Math.random() - 0.5) * 0.02;
      const lngVariation = (Math.random() - 0.5) * 0.02;
      
      // Random street address
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const streetNumber = Math.floor(Math.random() * 150) + 1;
      
      // Random postal code (Israel has 7-digit postal codes)
      const zipCode = Math.floor(1000000 + Math.random() * 9000000).toString();
      
      // Random order items (1-5 items)
      const numOrderItems = Math.floor(Math.random() * 4) + 1;
      const orderProducts = [];
      let totalAmount = 0;
      
      // Ensure at least one pizza in each order
      const pizzaProducts = products.filter(p => p.type === ProductType.PIZZA);
      const randomPizza = pizzaProducts[Math.floor(Math.random() * pizzaProducts.length)];
      const pizzaQuantity = Math.floor(Math.random() * 2) + 1; // 1 or 2 pizzas
      
      orderProducts.push({
        productId: randomPizza._id,
        quantity: pizzaQuantity,
        price: randomPizza.price,
        name: randomPizza.name,
        description: randomPizza.description,
        type: randomPizza.type
      });
      
      totalAmount += randomPizza.price * pizzaQuantity;
      
      // Add other random products
      for (let j = 0; j < numOrderItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
        
        // Check if product already in order
        const existingProductIndex = orderProducts.findIndex(
          op => op.productId.toString() === randomProduct._id.toString()
        );
        
        if (existingProductIndex >= 0) {
          orderProducts[existingProductIndex].quantity += quantity;
          totalAmount += randomProduct.price * quantity;
        } else {
          orderProducts.push({
            productId: randomProduct._id,
            quantity: quantity,
            price: randomProduct.price,
            name: randomProduct.name,
            description: randomProduct.description,
            type: randomProduct.type
          });
          
          totalAmount += randomProduct.price * quantity;
        }
      }
      
      // Random order time (from 14 days ago to now)
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const orderTime = new Date(twoWeeksAgo.getTime() + Math.random() * (now.getTime() - twoWeeksAgo.getTime()));
      
      // Random status (weighted to have more active orders)
      let status;
      const statusRoll = Math.random();
      
      if (statusRoll < 0.35) {
        status = OrderStatus.RECEIVED;
      } else if (statusRoll < 0.60) {
        status = OrderStatus.PREPARING;
      } else if (statusRoll < 0.80) {
        status = OrderStatus.READY;
      } else if (statusRoll < 0.90) {
        status = OrderStatus.EN_ROUTE;
      } else {
        status = OrderStatus.DELIVERED;
      }
      
      // Create the order
      orders.push({
        userId,
        products: orderProducts,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status,
        deliveryAddress: {
          street: `${streetName} ${streetNumber}`,
          city: cityInfo.city,
          zipCode,
          country: 'Israel',
          geoLocation: {
            latitude: cityInfo.coords.latitude + latVariation,
            longitude: cityInfo.coords.longitude + lngVariation
          }
        },
        orderNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: orderTime,
        updatedAt: orderTime
      });
    }
    
    // Insert all orders
    await this.orderModel.insertMany(orders);
    this.logger.log(`Added 300 orders`);
  }
}
