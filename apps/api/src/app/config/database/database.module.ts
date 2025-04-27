import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Check if we should use the in-memory database
        const useInMemory = configService.get<string>('USE_IN_MEMORY_DB') === 'true';
        
        if (useInMemory) {
          // Start an in-memory MongoDB instance
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          console.log('Using in-memory MongoDB instance at:', uri);
          
          // This clean-up is important for long-running apps
          process.on('SIGTERM', async () => {
            await mongod.stop();
          });
          
          return {
            uri,
          };
        } else {
          // Use the real MongoDB connection from env variables
          return {
            uri: configService.get<string>('MONGODB_URI'),
          };
        }
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}