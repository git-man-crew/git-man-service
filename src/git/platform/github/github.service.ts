import { GitPlatform } from '../git-platform.model';
import { HttpService } from '@nestjs/common';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export class GithubService implements GitPlatform {
  private config: AxiosRequestConfig;
  public metadata = {
    apiUrl: 'https://api.github.com',
    name: 'Github',
  };

  constructor(private httpService: HttpService) {
    this.config = {
      headers: {
        Authorization: `Basic ${process.env.basicAuthToken}`,
      },
    };
  }

  async auth() {
    return await this.httpService
      .get(this.metadata.apiUrl, this.config)
      .toPromise()
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch(error => {
        return 'Error auth...';
      });
  }

  async getRepositories(): Promise<any> {
    return await this.httpService
      .get(
        `${this.metadata.apiUrl}/users/${process.env.user}/repos`,
        this.config,
      )
      .toPromise()
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch(error => {
        return 'Error fetch repos...';
      });
  }
}
