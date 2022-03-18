import { ApiProperty } from "@nestjs/swagger";
import { Favorite } from "@prisma/client";
import { IsNotEmpty } from "class-validator";

export class CreateFavoriteDto {
  @ApiProperty()
  @IsNotEmpty()
  urlId: string;
}

export class FavoriteResponseDto implements Favorite {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  urlId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}