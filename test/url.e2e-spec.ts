import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UrlModule } from 'src/modules/url/url.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SignupBodyDto } from 'src/dtos/auth.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const user: SignupBodyDto = { email: 'url-test@gmail.com', password: '123456', name: 'url-test' }
  let authorization: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UrlModule, AuthModule],
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
      it('should register a new url without user', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const response = await request(app.getHttpServer())
          .post('/url').send(url)
        expect(response.status).toBe(201)
        expect(response.body.userId).toBeNull();
      })
      it('should return a exception because token invalid', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const response = await request(app.getHttpServer())
          .post('/url').set({authorization: 'Bearer 123'}).send(url)
        expect(response.status).toBe(401)
        expect(response.body.message).toBe("token not valid");
      })
      it('should register a new url with user', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const response = await request(app.getHttpServer())
          .post('/url').set({authorization}).send(url)
        expect(response.status).toBe(201)
        expect(response.body.userId).not.toBeNull();
      })
    })
    describe('list by user', ()=>{
      it('should list urls created by user authenticated', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        await request(app.getHttpServer())
          .get('/url').set({ authorization }).send(url)
        const response = await request(app.getHttpServer())
        .get('/url').set({authorization})
        expect(response.body.length).not.toBeNull()
      })
    })
    describe('get by id', ()=>{
      it('should find url by id', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const urlCreated = await request(app.getHttpServer())
          .post('/url').set({ authorization }).send(url)
        const response = await request(app.getHttpServer())
          .get(`/url/${urlCreated.body.id}`)
        expect(response.body.id).toBe(urlCreated.body.id)
      })
      it('should return a exception case url not found', async ()=>{
        const response = await request(app.getHttpServer())
          .get('/url/123')
        expect(response.status).toBe(404)
      })
    })
    describe('delete', ()=>{
      it('should return a exception when not authenticated', async ()=>{
        const response = await request(app.getHttpServer())
          .delete('/url/123')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("token not provided");
      })
      it('should return a exception when url not found', async ()=>{
        const response = await request(app.getHttpServer())
          .delete('/url/123').set({authorization})
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Url not found");
      })
      it('should delete a url', async ()=>{
        const url = { originalUrl: 'http://example.com' }
        const urlCreated = await request(app.getHttpServer())
          .post('/url').set({ authorization }).send(url)
        const response = await request(app.getHttpServer())
          .delete(`/url/${urlCreated.body.id}`).set({ authorization })
        expect(response.status).toBe(200)
      })
    })
  });
});
