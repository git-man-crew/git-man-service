import { Controller, Get, Param } from '@nestjs/common';
import { GitService } from './git.service';
import { GitPlatform } from './platform/git-platform.model';

@Controller('git')
export class GitController {
  private platform: GitPlatform;

  constructor(private readonly gitService: GitService) {}

  @Get('/allRepos/:platform')
  public allRepos(@Param('platform') platform: platform): any {
    this.gitService.setContext(this.gitService.create(platform));
    return this.gitService.getAllRepositories();
  }
}

export type platform = 'Github' | 'Bitbucket' | 'Gitlab';
