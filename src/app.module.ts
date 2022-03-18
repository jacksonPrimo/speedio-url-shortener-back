import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UrlModule } from './modules/url/url.module';
import { FavoriteModule } from './modules/favorite/favorite.module';

@Module({
  imports: [AuthModule, UrlModule, FavoriteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
