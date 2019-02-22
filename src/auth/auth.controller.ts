import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * returns a custom firebase jwt token
   * if firebase uid based authentication is valid
   * @param req object - request object
   */
  @Get('token')
  async createToken(@Request() req): Promise<any> {
    return await this.authService.createFirebaseToken(
      req.headers.fbauthorization,
    );
  }

  // @Get('token')
  // async createToken(): Promise<any> {
  //   return await this.authService.createToken();
  // }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}
