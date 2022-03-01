import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import { LoggedGuard } from 'src/guards/logged.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @ApiOkResponse({ description: 'user found' })
  async list(
    @Param() params: any
  ): Promise<UserModel[]> {
    const users = await this.userService.list(params);
    return users
  }
}
