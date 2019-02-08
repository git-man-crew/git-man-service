import { Injectable, Logger } from '@nestjs/common';
import * as fbAdmin from 'firebase-admin';

@Injectable()
export class UsermanagementService {
  readonly dbUrl = process.env.basicAuthToken;

  constructor() {
    this.initApp();
  }

  private initApp() {
    let serviceAccount = require('./secrets/gitman-web-firebase-adminsdk.json');

    fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(serviceAccount),
      databaseURL: this.dbUrl,
    });
  }

  public async validUid(uid: string): Promise<Boolean> {
    return fbAdmin
      .auth()
      .getUser(uid)
      .then(userRecord => {
        Logger.log(userRecord.toJSON());
        return true;
      })
      .catch(error => {
        Logger.error(error);
        return false;
      });
  }

  async getUser() {}
}
