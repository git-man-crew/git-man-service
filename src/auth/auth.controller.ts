import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsermanagementService } from 'src/usermanagement/usermanagement.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsermanagementService,
  ) {}

  /**
   * Generate Token if fbauthorization is valid
   * @param req
   */
  @Get('token')
  async createToken(@Request() req): Promise<any> {
    //todo:validate uid from fb  (exception: not found service)
    if (await this.userService.validUid(req.headers.fbauthorization)) {
      return await this.authService.createToken();
    } else {
      throw UnauthorizedException;
    }
  }

  @Get('data')
  @UseGuards(AuthGuard())
  findAll() {
    // This route is restricted by AuthGuard
    // JWT strategy
  }
}
