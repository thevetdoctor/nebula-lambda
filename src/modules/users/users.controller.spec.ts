import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { SuccessResponseInterceptor } from 'src/filters/success-response.interceptor';

describe('UsersController', () => {
  let controller: UsersController;

  const sampleUser = () => ({
    firstName: 'firstname',
    lastName: 'lastname',
    email: 'email@email.com',
  });
  const userId = '1';
  const incorrectUserId = 'not-found-id';

  const mockUser = { id: userId, name: 'John Doe' };

  const mockUsersService = {
    getUser: jest.fn().mockResolvedValue(mockUser),
    createUser: jest.fn((dto): CreateUserDto => ({ id: '1', ...dto })),
    listUsers: jest.fn().mockResolvedValue({}),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Test usersController', () => {
    it('Get a specific user by ID', async () => {
      const result = await controller.getUser(userId);
      expect(result).toStrictEqual(mockUser);
      expect(mockUsersService.getUser).toHaveBeenCalledWith(userId);
    });

    it('throws NotFoundException error when specific user not found', async () => {
      mockUsersService.getUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.getUser(incorrectUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.getUser).toHaveBeenCalledWith(userId);
    });

    it('Create a user', async () => {
      const sampleUserPayload = sampleUser();
      expect(await controller.createUser(sampleUserPayload)).toStrictEqual({
        id: '1',
        ...sampleUserPayload,
      });
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        sampleUserPayload,
      );
    });

    it('Get the list of users', async () => {
      const query = {
        limit: '10',
        nextToken: 'null',
      };
      const result = await controller.listUsers(query);
      expect(result).toEqual({});
      expect(mockUsersService.listUsers).toHaveBeenCalledWith(query);
    });

    it('Delete a specific user by ID', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      await expect(controller.deleteUser(userId)).resolves.toBeUndefined();
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('throws NotFoundException error when specific user not found', async () => {
      mockUsersService.deleteUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.deleteUser(incorrectUserId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('HttpExceptionFilter', () => {
    it('formats HttpException correctly', () => {
      const filter = new HttpExceptionFilter();

      const exception = new BadRequestException('Invalid input');
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const host = {
        switchToHttp: () => ({
          getResponse: () => response,
          getRequest: () => ({ url: '/test' }),
        }),
      } as any;

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid input',
        }),
      );
    });
  });

  describe('HttpExceptionFilter', () => {
    it('formats HttpException correctly', () => {
      const filter = new HttpExceptionFilter();
      const interceptor = new SuccessResponseInterceptor();

      const exception = new BadRequestException('Invalid input');
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const host = {
        switchToHttp: () => ({
          getResponse: () => response,
          getRequest: () => ({ url: '/test' }),
        }),
      } as any;

      filter.catch(exception, host);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid input',
        }),
      );
    });
  });
});
