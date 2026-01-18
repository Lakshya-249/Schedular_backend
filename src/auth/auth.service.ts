import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { GoogleLoginDto } from './dto/googe-login.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'node_modules/bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async google_login(dto: GoogleLoginDto) {
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

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid user credentials');

    const compare = await bcrypt.compare(dto.password, user.password);
    if (!compare) throw new UnauthorizedException('Invalid user credentials');

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };

    return this.jwtService.signAsync(payload);
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user) throw new UnauthorizedException('User already exists');
    return this.userService.registerUser(dto);
  }
}
