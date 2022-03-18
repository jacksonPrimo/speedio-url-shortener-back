import { HttpException, Injectable } from '@nestjs/common';
import { Favorite, Url } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(
    private prisma: PrismaService,
  ){}
  async create(data: any){
    const urlFound = await this.prisma.url.findFirst({
      where: { id: data.urlId }
    })
    if(!urlFound){
      throw new HttpException('Url not found', 404);
    }
    return await this.prisma.favorite.create({
      data
    })
  }
  async delete(id: string, userId: string): Promise<Favorite> {
    const favoriteFound = await this.prisma.favorite.findFirst({
      where: { id, userId }
    })
    if(!favoriteFound){
      throw new HttpException('Favorite not found', 404);
    }
    return await this.prisma.favorite.delete({
      where: { id }
    });
  }
}
