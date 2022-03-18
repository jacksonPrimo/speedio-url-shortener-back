import { Body, Controller, Delete, Get, Headers, HttpException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CreateFavoriteDto } from 'src/dtos/favorite.dto';
import { FavoriteResponseDto } from 'src/dtos/favorite.dto';
import { LoggedGuard } from 'src/guards/logged.guard';
import { TokenUtil } from 'src/utils/token.util';
import { FavoriteService } from './favorite.service';
import { Favorite as FavoriteModel, Url } from '@prisma/client'

@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService, private tokenUtil: TokenUtil) {}  

  @Post()
  @UseGuards(LoggedGuard)
  @ApiBody({type: CreateFavoriteDto})
  @ApiOkResponse({ description: 'favorite created', type: FavoriteResponseDto })
  async create(
    @Headers() headers: any,
    @Body() body: CreateFavoriteDto,
  ): Promise<FavoriteModel> {
    const { authorization } = headers;
    const [, token] = authorization.split(' ');

    if (!token) {
      throw new HttpException('token not provided', 403);
    }
    await this.tokenUtil.validateToken(token);
    const { id: userId } = this.tokenUtil.decodeToken(token)
    const favoriteCreated = await this.favoriteService.create({...body, userId});
    return favoriteCreated
  }

  @Delete('/:id')
  @UseGuards(LoggedGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'favorite id',
  })
  @ApiOkResponse({description: 'successful on delete favorite!', type: FavoriteResponseDto})
  @UseGuards(LoggedGuard)
  async delete(
    @Param() params: { id: string },
    @Headers() headers: any
  ): Promise<FavoriteModel> {
    const { authorization } = headers;
    const [, token] = authorization.split(' ');
    const { id: userId } = this.tokenUtil.decodeToken(token)
    const favoriteDeleted = await this.favoriteService.delete(params.id, userId)
    return favoriteDeleted
  }
}
