import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

describe('Users', () => {
  let provider: UsersRepository;

  const mockDynamoClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: DynamoDBClient,
          useValue: mockDynamoClient,
        },
      ],
    }).compile();

    provider = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return user when found by userId', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@doe.com' };

      mockDynamoClient.send.mockResolvedValue({
        Items: [mockUser],
      });

      const result = await provider.findUserById(mockUser.id);
      expect(result.Items[0]).toEqual(mockUser);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return user when found by userEmail', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@doe.com' };

      mockDynamoClient.send.mockResolvedValue({
        Items: [mockUser],
      });

      const result = await provider.findUserByEmail(mockUser.email);
      expect(result.Items[0]).toEqual(mockUser);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@doe.com' };

      mockDynamoClient.send.mockResolvedValue({
        Items: [mockUser],
      });

      const result = await provider.createUser(mockUser);
      expect(result).toEqual(mockUser);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@doe.com' };

      mockDynamoClient.send.mockResolvedValue({
        Items: [mockUser],
      });

      const result = await provider.getAllUsers({});
      expect(result.Items).toEqual([mockUser]);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('getUsersCount', () => {
    it('should return the total count of users', async () => {
      mockDynamoClient.send.mockResolvedValue({
        Count: 1,
      });

      const result = await provider.getUsersCount();
      expect(result).toBe(1);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a specific user by Id', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDynamoClient.send.mockResolvedValue({});

      const result = await provider.deleteUser(mockUser.id, mockUser.createdAt);
      expect(result).toBe(undefined);
      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });
});
