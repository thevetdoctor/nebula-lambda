import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DYNAMODB, tables } from 'src/constants/environment.';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  constructor(@Inject(DYNAMODB) private client: DynamoDBClient) {}

  async onModuleInit() {
    await this.ensureTables(
      tables.map((table) => ({ name: table, key: 'id' })),
    );
  }

  private async ensureTables(tables: { name: string; key: string }[]) {
    for (const table of tables) {
      await this.ensureSingleTable(table);
    }
  }

  private async ensureSingleTable(table: { name: string; key: string }) {
    const { name, key } = table;

    try {
      await this.client.send(new DescribeTableCommand({ TableName: name }));

      console.log(`Table "${name}" already exists`);
    } catch (err: any) {
      if (err.name === 'ResourceNotFoundException') {
        console.log(`Creating table "${name}"...`);

        await this.client.send(
          new CreateTableCommand({
            TableName: name,
            KeySchema: [
              { AttributeName: key, KeyType: 'HASH' },
              { AttributeName: 'createdAt', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
              { AttributeName: key, AttributeType: 'S' },
              { AttributeName: 'createdAt', AttributeType: 'S' },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          }),
        );

        console.log(`Table "${name}" created successfully`);
      } else {
        console.error(`Error checking table "${name}":`, err);
      }
    }
  }
}
