import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeoLocationService } from './geolocation.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [GeoLocationService],
  exports: [GeoLocationService],
})
export class GeoLocationModule {}