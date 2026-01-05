import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DynamoModule } from '../dynamodb/dynamodb.module';
import { UsersRepository } from './users.repository';
import { AppCacheModule } from '../cache/cache.module';

@Module({
  imports: [DynamoModule, AppCacheModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
