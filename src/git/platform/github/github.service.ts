import { GitPlatform } from '../git-platform.model';
import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Meta } from './Meta';

export class GithubService implements GitPlatform {
  private config: AxiosRequestConfig;

  constructor(private httpService: HttpService) {
    this.config = {
      headers: {
        Authorization: `Basic ${process.env.basicAuthToken}`,
      },
    };
  }

  async auth() {
    return await this.httpService
      .get(Meta.authUrl, this.config)
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
      .get(`${Meta.authUrl}/users/${process.env.user}/repos`, this.config)
      .toPromise()
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch(error => {
        return 'Error fetch repos...';
      });
  }
}
