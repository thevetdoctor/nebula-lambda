import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUsersDto } from './user.dto';
import { UsersRepository } from './users.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

      const allUsersKey = `users:list:limit=${limit}:token=${nextToken ?? 'first'}`;
      let users;
      const cachedUsers = await this.cacheManager.get<string>(allUsersKey);
      const ttl = await this.cacheManager.ttl(allUsersKey);
      const remainingTime = () =>
        `${ttl ? Math.round((ttl - Date.now()) / 1000) : 0}`;
      if (cachedUsers) {
        users = cachedUsers;
        console.log(
          '✅ Cache Hit:',
          'users',
          users.users.length,
          'total',
          users.total,
          'page',
          users.page,
          `Remaining: ${remainingTime()}s`,
        );
        return cachedUsers;
      } else {
        console.log(
          '✅ Cache Miss:',
          'users',
          users?.users.length,
          'total',
          users?.total,
          'page',
          users?.page,
          `Remaining: ${remainingTime()}s`,
        );
      }
      const parsedLimit = Number(limit ?? '10');
      const total = await this.usersRepo.getUsersCount();
      const result = await this.usersRepo.getAllUsers({
        limit: parsedLimit,
        nextToken,
      });

      const page = !nextToken ? prevPage : Number(prevPage) + 1;
      nextToken = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            'base64',
          )
        : undefined;
      const response = {
        users: result.Items,
        count: result.Items?.length,
        total,
        page,
        pageSize: parsedLimit,
        nextToken:
          !nextToken || page * Number(limit) === total
            ? null
            : `${nextToken}:${page}`,
      };
      await this.cacheManager.set(allUsersKey, response);
      return response;
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
