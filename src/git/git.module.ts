import { Module, HttpModule } from '@nestjs/common';
import { GitController } from './git.controller';
import { GitService } from './git.service';
import { PlatformService } from './platform/platform.service';

@Module({
  imports: [HttpModule],
  controllers: [GitController],
  providers: [GitService, PlatformService],
})
export class GitModule {}
