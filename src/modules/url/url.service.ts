import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Url } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async find(id: string): Promise<Url> {
    const urlFound = await this.prisma.url.findFirst({
      where: { id }
    });
    if(!urlFound){
      throw new HttpException('Url not found', 404);
    }
    await this.prisma.url.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    })
    return urlFound
  }

  async list(userId: string): Promise<Url[]> {
    const urlFound = await this.prisma.url.findMany({
      where: { userId }
    });
    if(!urlFound || !urlFound.length){
      throw new HttpException('Urls not found for this user', 404);
    } 
    return urlFound
  }

  async listTop100(userId?: string): Promise<Url[]> {
    let urlFound: any[]
    if(userId){
      urlFound = await this.prisma.url.findMany({
        take: 100,
        orderBy: { views: 'desc' },
        include: {
          favorite: {
            select: { id: true },
            where: {
              userId
            }
          }
        }
      });
      urlFound = urlFound.map((url: any)=>{
        if(url.favorite.length){
          url.favorite = url.favorite[0].id;
        } else {
          url.favorite = null
        }
        return url
      })
    } else {
      urlFound = await this.prisma.url.findMany({
        take: 100,
        orderBy: { views: 'desc' },
      });
    }

    if(!urlFound || !urlFound.length){
      throw new HttpException('Urls not found', 404);
    }
    return urlFound
  }

  async create(url: { originalUrl: string, userId?: string}): Promise<Url> {
    const { originalUrl, userId } = url
    var uid = new ShortUniqueId()
    const data = {
      originalUrl,
      userId,
      id: "",
    } as Prisma.UrlCreateInput
    let idAlreadyExist = true
    let urlCreated: Url;
    while(idAlreadyExist){
      data.id = uid.randomUUID(+process.env.LENGTH_URL_ID || 5)
      try {
        urlCreated = await this.prisma.url.create({
          data
        })
        idAlreadyExist = false;
      }
      catch(e){
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          idAlreadyExist = false;
        } else {
          throw e
        }
      }
    }
    return urlCreated;
  }

  async delete(id: string, userId: string): Promise<Url> {
    const urlFound = await this.prisma.url.findFirst({
      where: { id, userId }
    })
    if(!urlFound){
      throw new HttpException('Url not found', 404);
    }
    return await this.prisma.url.delete({
      where: { id }
    });
  }
}
