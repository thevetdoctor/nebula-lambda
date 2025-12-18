import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { userTable } from '../../constants/environment';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DynamoDBClient) {}

  async findUserById(userId: string): Promise<any> {
    try {
      return await this.db.send(
        new ScanCommand({
          TableName: userTable,
          FilterExpression: 'id = :id',
          ExpressionAttributeValues: {
            ':id': userId,
          },
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<any> {
    try {
      return await this.db.send(
        new ScanCommand({
          TableName: userTable,
          FilterExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email,
          },
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: any): Promise<any> {
    try {
      await this.db.send(
        new PutCommand({
          TableName: userTable,
          Item: user,
        }),
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers({
    limit,
    nextToken,
  }: {
    limit?: string;
    nextToken?: string;
  }): Promise<any> {
    try {
      const parsedLimit = Number(limit ?? '10');
      const params: any = {
        TableName: userTable,
        Limit: parsedLimit,
      };
      if (nextToken) {
        params.ExclusiveStartKey = nextToken;
      }
      return await this.db.send(new ScanCommand(params));
    } catch (error) {
      throw error;
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      const { Count } = await this.db.send(
        new ScanCommand({
          TableName: userTable,
          Select: 'COUNT',
        }),
      );
      return Count ?? 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string, createdAt: string): Promise<void> {
    try {
      await this.db.send(
        new DeleteCommand({
          TableName: userTable,
          Key: {
            id: userId,
            createdAt: createdAt,
          },
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
