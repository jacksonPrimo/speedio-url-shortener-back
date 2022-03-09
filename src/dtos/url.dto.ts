import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";
import { Url } from '@prisma/client'

export class CreateUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}

export class UrlResponseDto implements Url {
  @ApiProperty()
  id: string;
  @ApiProperty()
  originalUrl: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  views: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}