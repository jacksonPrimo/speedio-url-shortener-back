import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokenUtil } from 'src/utils/token.util';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, PrismaService, TokenUtil]
})
export class FavoriteModule {}
