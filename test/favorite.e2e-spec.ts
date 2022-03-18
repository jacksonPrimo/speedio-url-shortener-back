import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlModule } from 'src/modules/url/url.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SignupBodyDto } from 'src/dtos/auth.dto';
import { CreateFavoriteDto } from 'src/dtos/favorite.dto';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const user: SignupBodyDto = { email: 'url-test@gmail.com', password: '123456', name: 'url-test' }
  let authorization: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UrlModule, AuthModule, FavoriteModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/auth/signup').send(user)
    const userAuthenticated = await request(app.getHttpServer()).post('/auth/signin').send({email:user.email, password: user.password})
    authorization = `Bearer ${userAuthenticated.body.accessToken}`;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/url', () => {
    describe('create', ()=>{
      it('should register a new favorite', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const urlCreated = await request(app.getHttpServer())
          .post('/url').send(url)
        const favorite: CreateFavoriteDto = {
          urlId: urlCreated.body.id
        }
        const response = await request(app.getHttpServer())
          .post('/favorite').set({authorization}).send(favorite)
        expect(response.status).toBe(201)
      })
      it('should return a exception when url not found', async ()=>{
        const favorite: CreateFavoriteDto = {
          urlId: '123456'
        }
        const response = await request(app.getHttpServer())
        .post('/favorite').set({authorization}).send(favorite)
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Favorite not found")
      })
      it('should return a exception because token invalid', async ()=>{
        const favorite: CreateFavoriteDto = {
          urlId: '123'
        }
        const response = await request(app.getHttpServer())
          .post('/favorite').set({authorization: 'Bearer 123'}).send(favorite)
        expect(response.status).toBe(401)
        expect(response.body.message).toBe("token not valid");
      })
    })
    describe('delete', ()=>{
      it('should return a exception when not authenticated', async ()=>{
        const response = await request(app.getHttpServer())
          .delete('/favorite/123')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("token not provided");
      })
      it('should return a exception when url not found', async ()=>{
        const response = await request(app.getHttpServer())
          .delete('/favorite/123').set({authorization})
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Favorite not found");
      })
      it('should delete a url', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const urlCreated = await request(app.getHttpServer())
          .post('/url').send(url)
        const favorite: CreateFavoriteDto = {
          urlId: urlCreated.body.id
        }
        const favoriteCreated = await request(app.getHttpServer())
          .post('/favorite').set({authorization}).send(favorite)
        
        const response = await request(app.getHttpServer())
          .delete(`/favorite/${favoriteCreated.body.id}`).set({authorization})
        expect(response.status).toBe(200)
      })
    })
  });
});
