import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { FbuserService } from './fbuser/fbuser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly fbuserService: FbuserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  /**
   * validate jwtpayload token
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    // const user = await this.fbuserService.validateUid(payload.uid);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
