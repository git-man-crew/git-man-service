import { Injectable, HttpService } from '@nestjs/common';
import { GitPlatform } from './platform/git-platform.model';
import { GithubService } from './platform/github/github.service';
import { platform } from './git.controller';

@Injectable()
export class GitService {
  private platform: GitPlatform;

  constructor(private readonly httpService: HttpService) {}

  setContext(gitplatform: GitPlatform) {
    this.platform = gitplatform;
  }

  create(platform: platform): GitPlatform {
    switch (platform) {
      case 'Github':
        return new GithubService(this.httpService);
        break;
      default:
        throw new Error('not supported platform');
    }
  }

  getAllRepositories(): Promise<any> {
    return this.platform.getRepositories();
  }
}
