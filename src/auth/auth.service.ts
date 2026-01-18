import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findOrCreateFromGoogle(dto);
    if (!user) throw new UnauthorizedException('Invalid user');

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };

    return this.jwtService.signAsync(payload);
  }
}
