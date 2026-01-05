import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;
  let cache: jest.Mocked<Cache>;

  const mockUsersRepository = {
    findUserById: jest.fn().mockResolvedValue({ Items: [] }),
    findUserByEmail: jest.fn().mockResolvedValue({ Items: [] }),
    getAllUsers: jest.fn(),
    getUsersCount: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn().mockResolvedValue({}),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    ttl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
    cache = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      const userId = '1';
      const mockUser = { id: userId, name: 'John Doe' };

      repository.findUserById.mockResolvedValue({
        Items: [mockUser],
      } as any);

      const result = await service.getUser(userId);

      expect(result).toEqual(mockUser);
      expect(repository.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 'missing-id';

      repository.findUserById.mockResolvedValue({
        Items: [],
      } as any);

      await expect(service.getUser(userId)).rejects.toThrow(NotFoundException);

      expect(repository.findUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      };
      const newUserId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const mockedUser = { newUserId, createdAt, updatedAt, ...dto };

      repository.findUserByEmail.mockResolvedValue({
        Items: [],
      } as any);
      repository.createUser.mockResolvedValue(mockedUser);

      const result = await service.createUser(dto);

      expect(result).toEqual(mockedUser);
      expect(repository.createUser).toHaveBeenCalledWith(dto);
    });

    it('should throw Error when user already exist', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      };
      const newUserId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const mockedUser = { newUserId, createdAt, updatedAt, ...dto };

      repository.findUserByEmail.mockResolvedValue({
        Items: [mockedUser],
      } as any);

      await expect(service.createUser(dto)).rejects.toThrow(Error);
      expect(repository.findUserByEmail).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('listUsers', () => {
    it('should return a list of users', async () => {
      const userId = '1';
      const mockUser = { id: userId, name: 'John Doe' };

      repository.getAllUsers.mockResolvedValue({
        Items: [mockUser],
      } as any);

      const result = await service.listUsers({});

      expect(result).toEqual({
        count: 1,
        nextToken: null,
        page: 1,
        pageSize: 10,
        total: undefined,
        users: [mockUser],
      });
      expect(repository.getAllUsers).toHaveBeenCalled();
    });

    // it('should throw NotFoundException when user does not exist', async () => {
    //   const userId = 'missing-id';

    //   repository.findUserById.mockResolvedValue({
    //     Items: [],
    //   } as any);

    //   await expect(service.getUser(userId)).rejects.toThrow(NotFoundException);

    //   expect(repository.findUserById).toHaveBeenCalledWith(userId);
    // });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      };
      const newUserId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const mockedUser = { id: newUserId, createdAt, updatedAt, ...dto };

      repository.findUserById.mockResolvedValue({
        Items: [mockedUser],
      } as any);
      repository.deleteUser.mockResolvedValue(undefined);

      const result = await service.deleteUser(mockedUser.id);

      expect(result).toEqual(undefined);
      expect(repository.findUserById).toHaveBeenCalledWith(mockedUser.id);
      expect(repository.deleteUser).toHaveBeenCalledWith(
        mockedUser.id,
        mockedUser.createdAt,
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      };
      const newUserId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const mockedUser = { id: newUserId, createdAt, updatedAt, ...dto };

      repository.findUserById.mockResolvedValue({
        Items: [],
      } as any);

      await expect(service.deleteUser(mockedUser.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findUserById).toHaveBeenCalledWith(mockedUser.id);
    });
  });
});
