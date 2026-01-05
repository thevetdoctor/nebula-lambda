import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DynamoModule } from './modules/dynamodb/dynamodb.module';
import { AppCacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 IMPORTANT
      envFilePath: '.env', // or ['.env', '.env.local']
    }),
    DynamoModule,
    UsersModule,
    AppCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
