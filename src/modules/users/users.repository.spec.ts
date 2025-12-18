import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { DynamoModule } from '../dynamodb/dynamodb.module';

describe('Users', () => {
  let provider: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DynamoModule],
      providers: [UsersRepository],
    }).compile();

    provider = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
