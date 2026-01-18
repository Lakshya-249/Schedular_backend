import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { GoogleLoginDto } from './dto/googe-login.dto';
import { ApiDtoResponse } from 'src/common/response/api.response';
import { cookieOptions } from 'src/common/config/cookieoptions.config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-google')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: GoogleLoginDto,
  ) {
    const token = await this.authService.google_login(dto);
    res.cookie('token', token, cookieOptions);
    return new ApiDtoResponse(200, 'Login successful');
  }

  @Post('login')
  async loginLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const token = await this.authService.login(dto);
    res.cookie('token', token, cookieOptions);
    return new ApiDtoResponse(200, 'Login successful');
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
    return new ApiDtoResponse(200, 'User registered');
  }
}
