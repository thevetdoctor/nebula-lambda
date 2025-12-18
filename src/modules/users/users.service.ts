import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DYNAMODB, userTable } from 'src/constants/environment.';
import { GetUsers } from './user.dto';

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

  async listUsers({ limit, nextToken }: GetUsers = {}) {
    try {
      let prevPage: any = 1;
      try {
        const validToken = (val) =>
          val && val !== 'null' && val !== 'undefined';
        if (validToken(nextToken)) {
          const splitToken: any = nextToken?.split(':');
          nextToken = splitToken[0];
          prevPage = splitToken[1];
          nextToken = JSON.parse(
            Buffer.from(nextToken as string, 'base64').toString('utf-8'),
          );
        } else {
          nextToken = undefined;
        }
      } catch (err) {
        throw new BadRequestException('Invalid pagination token');
      }
      const { Count } = await this.db.send(
        new ScanCommand({
          TableName: userTable,
          Select: 'COUNT',
        }),
      );
      const queryPayload: any = {
        TableName: userTable,
      };
      if (nextToken) {
        queryPayload.ExclusiveStartKey = nextToken;
      }
      const parsedLimit = Number(limit ?? '10');
      if (limit) {
        queryPayload.Limit = parsedLimit;
      }
      const result = await this.db.send(new ScanCommand(queryPayload));
      const page = !nextToken ? prevPage : Number(prevPage) + 1;
      nextToken = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            'base64',
          )
        : undefined;
      return {
        users: result.Items,
        count: result.Items?.length,
        total: Count,
        page,
        pageSize: Number(limit),
        nextToken:
          !nextToken || page * Number(limit) === Count
            ? null
            : `${nextToken}:${page}`,
      };
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
