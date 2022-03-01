import { Module } from '@nestjs/common';
import { LoggedGuard } from 'src/guards/logged.guard';
import { PrismaService } from 'src/prisma.service';
import { TokenUtil } from 'src/utils/token.util';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [ UserService, PrismaService ],
})
export class UserModule {}
