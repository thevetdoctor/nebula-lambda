import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import KeyvRedis from 'keyv-redis';
import {
  cacheTtl,
  redisHost,
  redisPassword,
  redisPort,
} from '../../constants/environment';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: new KeyvRedis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
        }),
        ttl: cacheTtl, // Keyv expects ms
      }),
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
