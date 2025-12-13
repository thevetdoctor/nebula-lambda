import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DYNAMODB, userTable } from 'src/constants/environment.';

@Injectable()
export class UsersService {
  constructor(@Inject(DYNAMODB) private readonly db: DynamoDBDocumentClient) {}

  async getUser(userId: string) {
    try {
      const result = await this.findUserById(userId);
      if (!result.Items || result.Items.length === 0) {
        throw new NotFoundException('User not found');
      }
      return result.Items?.[0] ?? null;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user) {
    try {
      const userExists = await this.findUserByEmail(user.email);
      if (userExists.Items && userExists.Items.length > 0) {
        throw new Error('User with this email already exists');
      }
      user.id = crypto.randomUUID();
      user.createdAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
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

  async listUsers() {
    try {
      const result = await this.db.send(
        new ScanCommand({ TableName: userTable }),
      );
      return { users: result.Items, count: result.Count };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const result = await this.findUserById(userId);
      if (!result.Items || result.Items.length === 0) {
        throw new NotFoundException('User not found');
      }
      await this.db.send(
        new DeleteCommand({
          TableName: userTable,
          Key: {
            id: userId,
            createdAt: result.Items[0].createdAt,
          },
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  private async findUserById(userId: string) {
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

  private async findUserByEmail(email: string) {
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
}
