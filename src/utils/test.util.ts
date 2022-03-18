import { Favorite, RefreshToken, Url, User } from "@prisma/client";

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
  static getUrlValidWithoutUser(): Url {
    const url: Url = {
      id: "1",
      userId: null,
      originalUrl: "example.com",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return url
  }
  static getUrlValidWithUser(): Url {
    const user = this.getUserValid()
    const url: Url = {
      id: "1",
      userId: user.id,
      originalUrl: "example.com",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return url
  }
  static getFavoriteValid(): Favorite {
    const user = this.getUserValid()
    const url = this.getUrlValidWithoutUser()
    const favorite: Favorite = {
      userId: user.id,
      id: '123456',
      urlId: url.id,
      createdAt: new Date(), 
      updatedAt: new Date()  
    }
    return favorite
  }
}