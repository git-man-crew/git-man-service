import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { CryptoModule } from '../crypto.module';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CryptoModule],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt test-data', () => {
    const testData: string = 'test-data';
    const encryptedData = service.encryptText(testData);
    expect(typeof encryptedData).toEqual('string');
  });

  it('should decrypt test-data', () => {
    const testData: string = 'test-data';
    const encryptedData = service.encryptText(testData);
    const decryptedData = service.decryptText(encryptedData);
    expect(decryptedData).toBe(testData);
  });
});
