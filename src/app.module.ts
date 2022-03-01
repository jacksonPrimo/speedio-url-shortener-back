import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenUtil } from './utils/token.util';
import { CryptographyUtil } from './utils/cryptography.util';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TokenUtil, CryptographyUtil],
})
export class AppModule {}
