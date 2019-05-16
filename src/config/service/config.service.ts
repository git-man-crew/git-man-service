import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly filePath: string;
  private readonly packageConfig: { [key: string]: any };
  private readonly envConfig: { [key: string]: string };
  private readonly encoding: string = 'utf8';

  constructor(filePath: string) {
    this.filePath = filePath;
    this.packageConfig = JSON.parse(
      fs.readFileSync(path.resolve('package.json'), this.encoding),
    );
    this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(this.filePath)));
  }

  getSystemProperty(key: string): string {
    return process.env[key] || this.envConfig[key];
  }

  getModuleProperty(key: string): string {
    return this.packageConfig[key];
  }
}
