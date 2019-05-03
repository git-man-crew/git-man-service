import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserModule } from '../user.module';

describe.skip('User.Repository', () => {
  let provider: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    provider = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
