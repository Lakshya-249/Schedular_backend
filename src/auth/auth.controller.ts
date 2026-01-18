import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiDtoResponse } from 'src/common/response/api.response';
import { cookieOptions } from 'src/common/config/cookieoptions.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const token = await this.authService.login(dto);
    res.cookie('token', token, cookieOptions);
    return new ApiDtoResponse(200, 'Login successful');
  }
}
