import { Module } from '@nestjs/common';
import { DynamoDBProvider } from './dynamodb.provider';
import { DynamoDBService } from './dynamodb.service';

@Module({
  providers: [DynamoDBService, DynamoDBProvider],
  exports: [DynamoDBProvider],
})
export class DynamoModule {}
