import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBService } from './dynamodb.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

describe('DynamoDBService', () => {
  let service: DynamoDBService;

  const mockDynamoClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDBService,
        {
          provide: DynamoDBClient,
          useValue: mockDynamoClient,
        },
      ],
    }).compile();

    service = module.get<DynamoDBService>(DynamoDBService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Initialise DB', () => {
    it('should not create table if it already exists', async () => {
      mockDynamoClient.send.mockResolvedValueOnce({});

      await service.onModuleInit();

      expect(mockDynamoClient.send).toHaveBeenCalled();
    });
  });

  describe('Setup DB', () => {
    it('should create table if it does not exist', async () => {
      mockDynamoClient.send
        .mockRejectedValueOnce({ name: 'ResourceNotFoundException' })
        .mockResolvedValueOnce({});

      await service.onModuleInit();

      expect(mockDynamoClient.send).toHaveBeenCalledTimes(4);
    });
  });
});
