import { Injectable, Logger } from '@nestjs/common';
import { GeoLocation,Address } from '@orders-app/types';

@Injectable()
export class GeoLocationService {
  private readonly logger = new Logger(GeoLocationService.name);

  async getCoordinatesFromAddress(address: Address): Promise<GeoLocation> {
    const query = `${address.street}, ${address.city}, ${address.zipCode}, ${address.country}`;

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'pizza-order-app',
        },
      });

      const result = response.data[0];

      if (!result) {
        this.logger.warn(`No coordinates found for address: ${query}`);
        return { latitude: 0, longitude: 0 };
      }

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    } catch (error) {
      this.logger.error('Geocoding error', error.stack || error);
      return { latitude: 0, longitude: 0 };
    }
  }
}
