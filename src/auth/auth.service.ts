import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { FbuserService } from './fbuser/fbuser.service';
import * as FirebaseAdmin from 'firebase-admin';
import { JwtFirebasePayload } from './interfaces/jwt-firebase.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly fbuserService: FbuserService,
  ) {}

  // async createToken() {
  //   const user: JwtPayload = {
  //     mail: 'test@me.com',
  //   };
  //   const accessToken = this.jwtService.sign(user);
  //   return {
  //     expiresIn: 90000,
  //     accessToken,
  //   };
  // }

  /**
   * validate firebase uid and create access token
   * @param fbUid string - firebase uid
   */
  async createFirebaseToken(fbUid: string) {
    if (await this.fbuserService.validateUid(fbUid)) {
      try {
        return {
          expiresIn: 90000,
          accessToken: await FirebaseAdmin.auth().createCustomToken(fbUid),
        };
      } catch (error) {
        throw UnauthorizedException;
      }
    } else {
      throw UnauthorizedException;
    }
  }

  // async validateUser(payload: JwtPayload): Promise<any> {
  //   // put some validation logic here
  //   // for example query user by id/email/username
  //   // return { email: 'test@email.com' };

  //   // const user = await this.fbuserService.validateUid(payload.uid);

  //   return {};
  // }

  async validateUser(payload: JwtFirebasePayload): Promise<any> {
    // put some validation logic here
    // for example query user by id/email/username
    // return { email: 'test@email.com' };

    // const user = await this.fbuserService.validateUid(payload.uid);

    return {};
  }
}
