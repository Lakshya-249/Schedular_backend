import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        errorCode: 'UNAUTHORIZED',
      });
    }

    return true;
  }

  private getToken(req: Request): string | null {
    const header = req.headers['authorization'];
    if (header?.startsWith('Bearer ')) {
      return header.split(' ')[1];
    }

    if (req.cookies?.token) {
      return req.cookies.token;
    }

    return null;
  }
}
