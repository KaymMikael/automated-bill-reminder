import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { type JwtPayload } from './auth.inferface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken } = request.cookies as Record<
      string,
      string | undefined
    >;

    if (!accessToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(accessToken);
      request.user = { id: payload.userId };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
