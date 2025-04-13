import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const host = configService.get('HOST') || 'localhost';
  
  app.setGlobalPrefix('api');
  
  app.enableCors();
  
  await app.listen(port, host);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/api/`
  );
}

bootstrap();