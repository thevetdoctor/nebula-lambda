import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    // findAll: jest.fn().mockResolvedValue([]),
    // findOne: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    // create: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    // update: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
    // remove: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
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
});
