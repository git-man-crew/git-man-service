import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FbuserService } from './fbuser/fbuser.service';
import * as FirebaseAdmin from 'firebase-admin';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fbuserService: FbuserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * returns a custom firebase jwt token
   * if firebase uid based authentication is valid
   * @param req object - request object
   */
  // @Get('token')
  // async createToken(@Request() req): Promise<any> {
  //   let uid = req.headers.fbauthorization;

  //   if (await this.fbuserService.validateUid(uid)) {
  //     try {
  //       return FirebaseAdmin.auth().createCustomToken(uid);
  //     } catch (error) {
  //       throw UnauthorizedException;
  //     }
  //   } else {
  //     throw UnauthorizedException;
  //   }
  // }
  @Get('token')
  async createToken(): Promise<any> {
    return await this.authService.createToken();
  }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}
