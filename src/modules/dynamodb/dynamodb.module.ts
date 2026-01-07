import { Module } from '@nestjs/common';
import { DynamoDBProvider } from './dynamodb.provider';
import { DynamoDBService } from './dynamodb.service';
import { EnvironmentService } from 'src/constants/environment.service';

@Module({
  providers: [DynamoDBService, DynamoDBProvider, EnvironmentService],
  exports: [DynamoDBProvider],
})
export class DynamoModule {}
