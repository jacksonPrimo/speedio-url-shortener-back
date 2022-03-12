import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export class SignupBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SigninBodyDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class RefreshTokenBodyDto {
  @ApiProperty()
  accessToken: string;
}
