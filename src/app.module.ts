import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitModule } from './git/git.module';
import { UsermanagementModule } from './usermanagement/usermanagement.module';

@Module({
  imports: [GitModule, UsermanagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
