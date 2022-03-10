import { Body, Controller, Delete, Get, Headers, HttpException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody,  ApiOkResponse } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { Url as UrlModel } from '@prisma/client'
import { TokenUtil } from 'src/utils/token.util';
import { CreateUrlDto, UrlResponseDto } from 'src/dtos/url.dto';
import { LoggedGuard } from 'src/guards/logged.guard';

@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService, private tokenUtil: TokenUtil) {}  
  @Get()
  @UseGuards(LoggedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'urls found', type: [UrlResponseDto] })
  async list(
    @Headers() headers: any
  ): Promise<UrlModel[]> {
    const { authorization } = headers;
    const [, token] = authorization.split(' ');
    const { id: userId } = this.tokenUtil.decodeToken(token)
    const urls = await this.urlService.list(userId);
    return urls
  }

  @Get('/mostViewed')
  @ApiOkResponse({ description: 'urls found', type: [UrlResponseDto] })
  async mostViwed(): Promise<UrlModel[]> {
    const urls = await this.urlService.listTop100();
    return urls
  }

  @Post()
  @ApiBody({type: CreateUrlDto})
  @ApiOkResponse({ description: 'url created', type: UrlResponseDto })
  async create(
    @Headers() headers: any,
    @Body() body: CreateUrlDto,
  ): Promise<UrlModel> {
    const { authorization } = headers;
    let urlCreated: UrlModel;
    if(authorization){
      const [, token] = authorization.split(' ');

      if (!token) {
        throw new HttpException('token not provided', 403);
      }
      await this.tokenUtil.validateToken(token);
      const { id: userId } = this.tokenUtil.decodeToken(token)
      urlCreated = await this.urlService.create({...body, userId});
    } else {
      urlCreated = await this.urlService.create(body);
    }
    return urlCreated
  }

  @Delete('/:id')
  @UseGuards(LoggedGuard)
  @ApiBearerAuth()
  @ApiOkResponse({description: 'successful on delete url!', type: UrlResponseDto})
  async delete(
    @Param() params: { id: string },
    @Headers() headers: any
  ): Promise<UrlModel> {
    const { authorization } = headers;
    const [, token] = authorization.split(' ');
    const { id: userId } = this.tokenUtil.decodeToken(token)
    const urlDeleted = await this.urlService.delete(params.id, userId)
    return urlDeleted
  }

  @Get('/:id')
  @ApiOkResponse({description: 'successful on delete url!', type: UrlResponseDto})
  async find(
    @Param() params: { id: string },
  ): Promise<UrlModel> {
    const urlDeleted = await this.urlService.find(params.id)
    return urlDeleted
  }
}
