import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import KeyvRedis from 'keyv-redis';
import {
  cacheTtl,
  isLambda,
  redisEnabled,
  redisHost,
  redisPassword,
  redisPort,
} from '../../constants/environment';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        if (isLambda || !redisEnabled) {
          return {
            ttl: cacheTtl,
          };
        }
        return {
          store: new KeyvRedis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
          }),
          ttl: cacheTtl, // Keyv expects ms
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
