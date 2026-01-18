import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { ModifiedRequest } from 'src/common/types/modified.request';
import { ApiDtoResponse } from 'src/common/response/api.response';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtGuard)
  async getUser(@Req() req: ModifiedRequest) {
    const user = await this.usersService.findById(req.user.id);

    return new ApiDtoResponse(200, 'User found', user);
  }
}
