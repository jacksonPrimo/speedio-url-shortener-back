import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { TokenUtil } from 'src/utils/token.util';

@Injectable()
export class LoggedGuard implements CanActivate {
  constructor(
    private tokenUtil: TokenUtil
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new HttpException('token not provided', 401);
    }
    const [, token] = authorization.split(' ');
    if (!token) {
      throw new HttpException('token not provided', 401);
    }
    await this.tokenUtil.validateToken(token);
    return true;
  }
}
