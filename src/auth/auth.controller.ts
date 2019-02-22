import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FbuserService } from './fbuser/fbuser.service';
import * as FirebaseAdmin from 'firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fbuserService: FbuserService,
  ) {}

  /**
   * return jwt token if firebase authentication is valid
   * @param req
   */
  @Get('token')
  async createToken(@Request() req): Promise<any> {
    let uid = req.headers.fbauthorization;

    if (await this.fbuserService.validateUid(uid)) {
      //return await this.authService.createToken();

      try {
        return FirebaseAdmin.auth().createCustomToken(uid);
      } catch (error) {
        Logger.error('Error creating custom token:', error);
      }
    } else {
      throw UnauthorizedException;
    }
  }

  /**
   * sample access with token constraints
   */
  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}
