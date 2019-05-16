import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigModule } from '../config.module';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get listening port of the dot env config', () => {
    const port: string = service.getSystemProperty('PORT');
    expect(port).toEqual('3000');
  });

  it('should get application name of the package module', () => {
    const packageName: string = service.getModuleProperty('name');
    expect(packageName).toEqual('git-man-service');
  });

  it('should init config module without NODE_ENV', async () => {
    delete process.env.NODE_ENV;
    const configModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const configService: ConfigService = configModule.get<ConfigService>(ConfigService);

    expect(configService).toBeDefined();
  });
});
