import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUsersDto } from './user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getUser(userId: string): Promise<any> {
    try {
      const result = await this.usersRepo.findUserById(userId);
      if (!result.Items || result.Items.length === 0) {
        throw new NotFoundException('User not found');
      }
      return result.Items?.[0] ?? null;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user): Promise<any> {
    try {
      const userExists = await this.usersRepo.findUserByEmail(user.email);
      if (userExists.Items && userExists.Items.length > 0) {
        throw new Error('User with this email already exists');
      }
      user.id = crypto.randomUUID();
      user.createdAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      const createdUser = await this.usersRepo.createUser(user);
      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  async listUsers({ limit, nextToken }: GetUsersDto): Promise<any> {
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
      const total = await this.usersRepo.getUsersCount();
      const result = await this.usersRepo.getAllUsers({ limit, nextToken });

      const page = !nextToken ? prevPage : Number(prevPage) + 1;
      nextToken = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            'base64',
          )
        : undefined;
      return {
        users: result.Items,
        count: result.Items?.length,
        total,
        page,
        pageSize: Number(limit),
        nextToken:
          !nextToken || page * Number(limit) === total
            ? null
            : `${nextToken}:${page}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<any> {
    try {
      const result = await this.usersRepo.findUserById(userId);
      if (!result.Items || result.Items.length === 0) {
        throw new NotFoundException('User not found');
      }
      await this.usersRepo.deleteUser(
        result.Items[0].id,
        result.Items[0].createdAt,
      );
    } catch (error) {
      throw error;
    }
  }
}
