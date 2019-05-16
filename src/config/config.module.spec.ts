import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './service/config.service';
import { ConfigModule } from './config.module';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        delete process.env.NODE_ENV;
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it('should init config module without NODE_ENV', () => {
        expect(service).toBeDefined();
    });
});
