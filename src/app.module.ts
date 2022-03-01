import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './prisma.service';
import { TokenUtil } from './utils/token.util';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, TokenUtil],
})
export class AppModule {}
