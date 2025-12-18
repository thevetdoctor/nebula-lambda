import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DynamoModule } from '../dynamodb/dynamodb.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [DynamoModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
