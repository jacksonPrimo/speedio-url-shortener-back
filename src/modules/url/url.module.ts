import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokenUtil } from 'src/utils/token.util';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, PrismaService, TokenUtil]
})
export class UrlModule {}
