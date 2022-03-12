import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CryptographyUtil } from 'src/utils/cryptography.util';
import { TokenUtil } from 'src/utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    private tokenUtil: TokenUtil,
    private cryptographyUtil: CryptographyUtil,
    private prisma: PrismaService,
  ){}
  async signup(data: Prisma.UserCreateInput): Promise<User> {
    data.password = this.cryptographyUtil.encryptPassword(data.password);
    try {
      const userCreated = await this.prisma.user.create({
        data,
      });
      return userCreated;
    }
    catch(e){
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new HttpException("Email already in use", 400)
      } else {
        throw e
      }
    }
  }
  async signin(email: string, password: string){
    const user = await this.prisma.user.findFirst({
      where: { email }
    })
    if(!user){
      throw new HttpException('Password or email invalid', 400);
    }
    const passwordIsValid = this.cryptographyUtil.comparePassword(password, user.password);
    if (!passwordIsValid) {
      throw new HttpException('Password or email invalid', 400);
    }
    const tokenCreated = this.tokenUtil.generateToken({email, id: user.id})
    
    const refreshTokenCreated = await this.prisma.refreshToken.create({
      data: this.tokenUtil.generateRefreshToken(user.id)
    })
    return {
      accessToken: tokenCreated,
      refreshToken: refreshTokenCreated.token
    }
  }
  async refreshToken(refreshToken: string){
    const refreshTokenFound = await this.prisma.refreshToken.findFirst({ 
      where: { token: refreshToken },
      include: { user: true } 
    });    
    if (!refreshTokenFound) {
      throw new HttpException("Refresh token is not in database", 403);
    }
    const tokenValid = this.tokenUtil.validateRefreshToken(refreshTokenFound)
    if (!tokenValid) {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } })
      throw new HttpException("Refresh token was expired. Please make a new signin request", 403);
    }
    const newAccessToken = this.tokenUtil.generateToken({
      email: refreshTokenFound.user.email,
      id: refreshTokenFound.user.id
    })
    return {
      accessToken: newAccessToken,
    };
  }
  async deleteToken(token){
    const refreshTokenFound = await this.prisma.refreshToken.findFirst({ 
      where: { token }, 
    });
    if (!refreshTokenFound) {
      throw new HttpException("Refresh token is not in database", 403);
    }
    return await this.prisma.refreshToken.delete({
      where: {
        token
      }
    })
  }
}
