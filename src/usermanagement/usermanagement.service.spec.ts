import { Test, TestingModule } from '@nestjs/testing';
import { UsermanagementService } from './usermanagement.service';

describe('UsermanagementService', () => {
  let service: UsermanagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsermanagementService],
    }).compile();

    service = module.get<UsermanagementService>(UsermanagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
