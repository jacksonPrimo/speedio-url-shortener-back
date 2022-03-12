import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SignupBodyDto } from 'src/dtos/auth.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth', () => {
    const userToCreate: SignupBodyDto = {
      email: 'auth-test@gmail.com',
      password: '123456',
      name: 'auth-test'
    }
    describe('signup', ()=>{
      it('should try make signup and fail because email already in use', async ()=>{
        await request(app.getHttpServer()).post('/auth/signup').send(userToCreate)
        const response = await request(app.getHttpServer())
          .post('/auth/signup').send(userToCreate)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Email already in use");
      })
      it('should make signup with success', async ()=>{
        const user = { email: `000${userToCreate.email}`, password: userToCreate.password, name: userToCreate.password}
        const response = await request(app.getHttpServer())
          .post('/auth/signup').send(user)
        expect(response.status).toBe(200)
      })
    })
    describe('signin', ()=>{
      it('should try make login and fail because user not exist', async ()=>{
        const response = await request(app.getHttpServer())
          .post('/auth/signin').send({ email: 'emailthatnotexist@gmail.com', password: '123456'})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Password or email invalid');
      })
      it('should try make login and fail because password wrong', async ()=>{
        const response = await request(app.getHttpServer())
          .post('/auth/signin').send({ email: userToCreate.email, password: `000${userToCreate.password}`})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('Password or email invalid');
      })
      it('should make login with success', async ()=>{
        const response = await request(app.getHttpServer())
          .post('/auth/signin').send({ email: userToCreate.email, password: userToCreate.password})
        expect(response.status).toBe(201)
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
      })
    })
    describe('refreshToken', ()=>{
      it('should make a refresh token', async ()=>{
        const {body: authentication} = await request(app.getHttpServer())
          .post('/auth/signin').send({ email: userToCreate.email, password: userToCreate.password})
        const response = await request(app.getHttpServer())
          .post('/auth/refreshToken').send({ refreshToken: authentication.refreshToken})
        expect(response.status).toBe(201)
        expect(response.body.accessToken).toBeDefined();
      })
      it('should return a exception when refresh-token not finded', async ()=>{
        const response = await request(app.getHttpServer())
          .post('/auth/refreshToken').send({ refreshToken: '123'})
        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Refresh token is not in database');
      })
    })
    describe('signout', ()=>{
      it('should make logout', async () => {
        const { body: authentication } = await request(app.getHttpServer())
          .post('/auth/signin').send({ email: userToCreate.email, password: userToCreate.password })
        const response = await request(app.getHttpServer())
          .delete(`/auth/signout/${authentication.refreshToken}`)
        expect(response.status).toBe(200)
      })
      it('should return a exception case refresh-token not found', async () => {
        const response = await request(app.getHttpServer())
          .delete('/auth/signout/123')
        expect(response.status).toBe(403)
      })
    })
  });
  
});
