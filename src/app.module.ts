import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [UserModule, ConfigModule, CryptoModule],
})
export class AppModule {}
