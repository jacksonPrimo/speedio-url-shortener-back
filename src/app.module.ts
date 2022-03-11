import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenUtil } from './utils/token.util';
import { CryptographyUtil } from './utils/cryptography.util';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [AuthModule, UrlModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TokenUtil, CryptographyUtil],
})
export class AppModule {}
