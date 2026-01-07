import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EnvironmentService } from 'src/constants/environment.service';

export const DynamoDBProvider = {
  provide: DynamoDBClient,
  inject: [EnvironmentService],
  useFactory: (env: EnvironmentService) => {
    const config = {
      region: env.region(),
      ...(env.isLocal() && {
        endpoint: env.DYNAMO_ENDPOINT(),
        credentials: {
          accessKeyId: env.accessKeyId(),
          secretAccessKey: env.secretAccessKey(),
        },
      }),
    };
    const client = new DynamoDBClient(config);

    return DynamoDBDocumentClient.from(client);
  },
};
