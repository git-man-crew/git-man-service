import { JwtAuthGuard, AuthGuardType } from './jwt-auth.guard';
import Substitute from '@fluffy-spoon/substitute';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });

  it('should can activate', () => {
    const jwtAuthGuard = new JwtAuthGuard();
    const contextMock = Substitute.for<ExecutionContext>();
    expect(jwtAuthGuard.canActivate(contextMock));
  });

  it('should handle request successfully without error', () => {
    const jwtAuthGuard = new JwtAuthGuard();
    const contextMock = Substitute.for<ExecutionContext>();
    const user = jwtAuthGuard.handleRequest(null, 'USER', null);
    expect(user).toEqual('USER');
  });

  it('should handle request with UnauthorizedException by nullable user', () => {
    const jwtAuthGuard = new JwtAuthGuard();
    expect(() => {
      jwtAuthGuard.handleRequest(null, null, null);
    }).toThrow(UnauthorizedException);
  });

  it('should handle request with general error', () => {
    const jwtAuthGuard = new JwtAuthGuard();
    const error = new Error();
    expect(() => {
      jwtAuthGuard.handleRequest(error, 'USER', null);
    }).toThrow(Error);
  });
});
