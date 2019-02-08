import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GitService } from './git.service';
import { GitPlatform } from './platform/git-platform.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('git')
export class GitController {
  private platform: GitPlatform;

  constructor(private readonly gitService: GitService) {}

  @Get('/allRepos/:platform')
  @UseGuards(AuthGuard())
  public allRepos(@Param('platform') platform: platform): any {
    try {
      this.gitService.setContext(this.gitService.create(platform));
      return this.gitService.getAllRepositories();
    } catch (error) {
      return 'platform not supported';
    }
  }

  @Get('supportedPlatform')
  @UseGuards(AuthGuard())
  public supportedPlatform(): any {
    return { supportedPlatforms: ['Github', 'Gitlab', 'Azure Devops (VSTS)'] };
  }
}

export type platform = 'Github' | 'Bitbucket' | 'Gitlab';
