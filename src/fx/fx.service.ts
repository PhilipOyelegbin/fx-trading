import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cache from 'memory-cache';

@Injectable()
export class FxService {
  constructor(private readonly config: ConfigService) {}

  async fxRates() {
    const cachedRates = cache.get('NGN');
    if (cachedRates) {
      return cachedRates;
    }

    const convertion = await fetch(
      `https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest?from=NGN`,
      {
        headers: {
          'x-rapidapi-key': this.config.getOrThrow('RAPIDAPI_KEY'),
          'x-rapidapi-host': this.config.getOrThrow('RAPIDAPI_HOST'),
        },
      },
    );

    const data = await convertion.json();
    // Cache the rates for performance (e.g., 10 minutes)
    cache.put('NGN', data, 10 * 60 * 1000);
    return data;
  }
}
