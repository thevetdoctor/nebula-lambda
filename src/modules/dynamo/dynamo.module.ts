import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamo.service';
import {
  accessKeyId,
  DYNAMO_ENDPOINT,
  DYNAMODB,
  isLocal,
  region,
  secretAccessKey,
} from 'src/constants/environment.';

@Module({
  providers: [
    {
      provide: DYNAMODB,
      useFactory: () => {
        const config = {
          region,
          ...(isLocal && {
            endpoint: DYNAMO_ENDPOINT,
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }),
        };

        const client = new DynamoDBClient(config);

        return DynamoDBDocumentClient.from(client);
      },
    },
    DynamoDBService,
  ],
  exports: [DYNAMODB],
})
export class DynamoModule {}
