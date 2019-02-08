import { Module, HttpModule } from '@nestjs/common';
import { GitController } from './git.controller';
import { GitService } from './git.service';
import { PlatformService } from './platform/platform.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [GitController],
  providers: [GitService, PlatformService],
})
export class GitModule {}
