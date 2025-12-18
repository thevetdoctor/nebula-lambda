import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBService } from './dynamodb.service';
import { DYNAMODB } from '../../constants/environment';
import { DynamoDBProvider } from './dynamodb.provider';

describe('DynamoDBService', () => {
  let service: DynamoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamoDBService, DynamoDBProvider],
    }).compile();

    service = module.get<DynamoDBService>(DynamoDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
