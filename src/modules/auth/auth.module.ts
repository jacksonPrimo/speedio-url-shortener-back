import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { TokenUtil } from 'src/utils/token.util';
import { CryptographyUtil } from 'src/utils/cryptography.util';

@Module({
  providers: [AuthService, TokenUtil, CryptographyUtil, PrismaService],
  controllers: [AuthController]
})
export class AuthModule {}
