import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user.module';

describe('JwtStrategy', () => {
  let provider: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    provider = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
