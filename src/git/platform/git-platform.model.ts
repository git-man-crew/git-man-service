import { HttpService } from '@nestjs/common';

export interface GitPlatform {
  auth(): Promise<any>;
  getRepositories(): Promise<any>;
}
