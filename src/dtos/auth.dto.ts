import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export class SignupBodyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
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
