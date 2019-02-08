import { Injectable } from '@nestjs/common';
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

  private checkUid(uid: string) {
    fbAdmin
      .auth()
      .getUser(uid)
      .then(userRecord => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
      })
      .catch(error => {
        console.log('Error fetching user data:', error);
      });
  }

  async getUser() {}
}
