import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GodAccountGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('Authorization header missing.');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token) as { isGodAccount?: boolean };

    // This part verifies if the token has godAccount in it's payload
    if (decodedToken && decodedToken.isGodAccount) {
      return true;
    }

    throw new ForbiddenException('You dont have permission to proceed.');
  }
}
