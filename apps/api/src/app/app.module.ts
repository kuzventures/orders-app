import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { SeederModule } from './common/seeders/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Check if we should use in-memory database
        const useInMemory = configService.get<string>('USE_IN_MEMORY_DB') === 'true';
        
        if (useInMemory) {
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          console.log('Using in-memory MongoDB instance at:', uri);
          
          // Cleanup when application stops
          process.on('SIGTERM', async () => {
            await mongod.stop();
          });
          
          return { uri };
        }
        
        // Use real MongoDB connection
        return {
          uri: configService.get<string>('MONGODB_URI'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    EventEmitterModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    OrderModule,
    ProductModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}