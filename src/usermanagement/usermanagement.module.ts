import { Module } from '@nestjs/common';
import { UsermanagementService } from './usermanagement.service';

@Module({
  providers: [UsermanagementService]
})
export class UsermanagementModule {}
