import { Body, Controller, Post, Res } from '@nestjs/common';
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
    @Res() res: Response
  ) {
    const userAuth = await this.authService.signin(body.email, body.password)
    res.status(200).send(userAuth)
  }

  @Post('refreshToken')
  @ApiOkResponse({description: 'refresh token success!', type: AccessTokenResponseDto})
  @ApiBody({ type: RefreshTokenBodyDto })
  async refreshToken(
    @Body() body: { refreshToken: string },
    @Res() res: Response
  ) {
    const newAccessToken = await this.authService.refreshToken(body.refreshToken)
    res.status(200).send(newAccessToken)
  }
}
