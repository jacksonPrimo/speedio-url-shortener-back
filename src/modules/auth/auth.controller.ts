import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenResponseDto, RefreshTokenBodyDto, SigninBodyDto, SignupBodyDto } from 'src/dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}
  @Post('signup')
  @ApiBody({type: SignupBodyDto})
  async signup(
    @Body() data: SignupBodyDto,
    @Res() res: Response
  ): Promise<any> {
    await this.authService.signup(data);
    res.status(200).send({message: 'user created'})
  }

  @Post('signin')
  @ApiOkResponse({ description: 'loggin success', type: AccessTokenResponseDto})
  @ApiBody({type: SigninBodyDto})
  async signin(
    @Body() body: {email: string, password: string},
  ) {
    return await this.authService.signin(body.email, body.password)
  }

  @Delete('signout/:token')
  @ApiOkResponse({description: 'signout success!'})
  @ApiBody({ type: RefreshTokenBodyDto })
  async signout(
    @Param() params: { token: string },
  ) {
    return await this.authService.deleteToken(params.token)
  }

  @Post('refreshToken')
  @ApiOkResponse({description: 'refresh token success!', type: AccessTokenResponseDto})
  @ApiBody({ type: RefreshTokenBodyDto })
  async refreshToken(
    @Body() body: { refreshToken: string },
  ) {
    return await this.authService.refreshToken(body.refreshToken)
  }
}
