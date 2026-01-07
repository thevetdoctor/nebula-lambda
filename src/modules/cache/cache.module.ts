import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import KeyvRedis from 'keyv-redis';
import { EnvironmentModule } from 'src/constants/environment.module';
import { EnvironmentService } from 'src/constants/environment.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (env: EnvironmentService) => {
        if (env.isLambda() || !env.redisEnabled()) {
          return {
            ttl: env.cacheTtl(),
          };
        }
        return {
          store: new KeyvRedis({
            host: env.redisHost(),
            port: env.redisPort(),
            password: env.redisPassword(),
          }),
          ttl: env.cacheTtl(), // Keyv expects ms
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
