import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  accessKeyId,
  DYNAMO_ENDPOINT,
  isLocal,
  region,
  secretAccessKey,
} from '../../constants/environment';

export const DynamoDBProvider = {
  provide: DynamoDBClient,
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
};
