import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as FirebaseAdmin from 'firebase-admin';

@Injectable()
export class FbuserService {
  readonly dbUrl = process.env.basicAuthToken;

  constructor() {
    this.initApp();
  }

  private initApp() {
    let serviceAccount = require('./secrets/gitman-web-firebase-adminsdk.json');

    FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert(serviceAccount),
      databaseURL: this.dbUrl,
    });
  }

  /**
   * check if uid exists
   * @param uid string - firebase user id
   */
  async validateUid(uid: string): Promise<Boolean> {
    return FirebaseAdmin.auth()
      .getUser(uid)
      .then(userRecord => {
        Logger.log(userRecord.toJSON());
        return true;
      })
      .catch(error => {
        return false;
      });
  }
}
