import { Module } from '@nestjs/common';
import { CryptoService } from './service/crypto.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule { }
