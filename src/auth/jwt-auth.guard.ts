import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if it's the login endpoint
    const request = context.switchToHttp().getRequest();
    if (request.url === '/auth/login' && request.method === 'POST') {
      return true;
    }

    return super.canActivate(context);
  }
}
