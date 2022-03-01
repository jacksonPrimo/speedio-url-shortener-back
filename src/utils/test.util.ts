import { RefreshToken, User } from "@prisma/client";

export class TestUtil {
  static getUserValid(): User {
    const user = {
      id: "1",
      name: 'teste01',
      email: "test01@gmail.com",
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return user;
  }
  static getRefreshTokenValid(): RefreshToken {
    const refreshToken: RefreshToken = {
      expiryDate: new Date(),
      token: '123456',
      userId: '1'
    }
    return refreshToken;
  }
}