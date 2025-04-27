import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Address, GeoLocation } from '@orders-app/types';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GeoLocationService {
  private readonly logger = new Logger(GeoLocationService.name);

  constructor(private readonly httpService: HttpService) {}

  async getCoordinatesFromAddress(address: Address): Promise<GeoLocation> {
    try {
      const addressString = `${address.street}, ${address.city}, ${address.zipCode}, ${address.country}`;
      const encodedAddress = encodeURIComponent(addressString);
      
      const { data } = await firstValueFrom(
        this.httpService.get(`https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`, {
          headers: {
            'User-Agent': 'PizzaOrderApp/1.0'
          }
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Geocoding error: ${error.message}`, error.stack);
            throw new Error('Failed to geocode address');
          }),
        ),
      );
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      
      this.logger.warn(`No geocoding results found for address: ${addressString}`);
      return this.getDefaultLocation();
      
    } catch (error) {
      this.logger.error(`Geocoding service error: ${error.message}`);
      return this.getDefaultLocation();
    }
  }

  private getDefaultLocation(): GeoLocation {
    return {
      latitude: 40.7128,
      longitude: -74.0060,
    };
  }
}
