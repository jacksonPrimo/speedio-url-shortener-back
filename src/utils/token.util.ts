import { HttpException, Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { decode, sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { v4 } from 'uuid';

interface TokenPayload {
  role: string;
  id: number;
}

@Injectable()
export class TokenUtil {
  private secret = 'apenasumtest'
  private jwtExpiration = 3600
  private jwtRefreshExpiration = 86400

  public generateToken(payload: any) {
    const token = sign({ ...payload }, this.secret, { expiresIn: this.jwtExpiration });
    return token;
  }
  public generateRefreshToken(userId: string) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + this.jwtRefreshExpiration);
    const refreshToken = {
      userId,
      token: v4(),      
      expiryDate: expiredAt
    };
    return refreshToken;
  }
  
  public async validateRefreshToken(token: RefreshToken){
    return token.expiryDate.getTime() > new Date().getTime();
  }

  public async validateToken(token: string) {
    try {
      return verify(token, this.secret);
    } catch (error) {
      if(error instanceof TokenExpiredError){
        throw new HttpException('token expired!', 401);
      } else {
        throw new HttpException('token not valid!', 401);
      }
    }
  }

  public decodeToken(token: string): TokenPayload {
    const decoded = decode(token);
    return decoded as TokenPayload;
  }
}
