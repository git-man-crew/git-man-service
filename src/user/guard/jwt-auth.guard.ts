import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Type,
} from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

export const AuthGuardType: Type<IAuthGuard> = AuthGuard('jwt');

@Injectable()
export class JwtAuthGuard extends AuthGuardType {

  constructor(...args) {
    super(...args);
  }

  canActivate(context: ExecutionContext) {
    // add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
