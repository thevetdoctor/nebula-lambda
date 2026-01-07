import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './user.dto';
import { EnvironmentService } from 'src/constants/environment.service';

@Injectable()
export class UsersRepository {
  userTable: string;
  constructor(
    private readonly db: DynamoDBClient,
    private env: EnvironmentService,
  ) {
    this.userTable = this.env.userTable();
  }

  async findUserById(userId: string): Promise<any> {
    try {
      return await this.db.send(
        new ScanCommand({
          TableName: this.userTable,
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
          TableName: this.userTable,
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
          TableName: this.userTable,
          Item: user,
        }),
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers({
    limit: parsedLimit,
    nextToken,
  }: GetUsersDto): Promise<any> {
    try {
      const params: any = {
        TableName: this.userTable,
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
          TableName: this.userTable,
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
          TableName: this.userTable,
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
