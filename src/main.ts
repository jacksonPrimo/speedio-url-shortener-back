import { HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // prisma config
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.use((error: any, request: Request, response: Response, nest: NextFunction)=>{
    console.log(error)
    if(error instanceof HttpException){
      response.send(error.getStatus).send(error.message)
    } else {
      response.send(500).send('server internal error')
    }
  })

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
