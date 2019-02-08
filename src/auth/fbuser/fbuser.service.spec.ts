import { Test, TestingModule } from '@nestjs/testing';
import { FbuserService } from './fbuser.service';

describe('FbuserService', () => {
  let service: FbuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FbuserService],
    }).compile();

    service = module.get<FbuserService>(FbuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
