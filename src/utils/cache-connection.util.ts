import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory<any> {
  // use generic to pass store specific options, used any for simplicity here
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5,
    };
  }
}
