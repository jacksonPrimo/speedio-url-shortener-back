import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { AccessTokenResponseDto, RefreshTokenBodyDto, SigninBodyDto, SignupBodyDto } from 'src/dtos/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { CryptographyUtil } from 'src/utils/cryptography.util';
import { TokenUtil } from 'src/utils/token.util';
import { TestUtil } from 'src/utils/test.util';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(), 
    },
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn()
    }
  }
  const mockCryptographyUtil = {
    encryptPassword: jest.fn(),
    comparePassword: jest.fn(),
  }
  const mockTokenUtil = {
    generateToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenUtil,
          useValue: mockTokenUtil
        },
        {
          provide: CryptographyUtil,
          useValue: mockCryptographyUtil
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signup', ()=>{
    it('should register a new user', async () => {
      const user = TestUtil.getUserValid()
      mockCryptographyUtil.encryptPassword.mockReturnValue('123456')
      mockPrismaService.user.create.mockResolvedValue(user)

      const newUser: SignupBodyDto = {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      }
      const userCreated = await authService.signup(newUser)
      expect(userCreated).toEqual(user)
    })
    it('should return a exception case email already in use', async () => {
      const user = TestUtil.getUserValid()
      mockCryptographyUtil.encryptPassword.mockReturnValue('123456')
      mockPrismaService.user.findFirst.mockResolvedValue(user)

      const newUser: SignupBodyDto = {
        email: 'test@gmail.com',
        name: 'test',
        password: 'test'
      }
      await authService.signup(newUser).catch(e=>{
        expect(e).toMatchObject({message: 'Email already in use'})
      })
    })
  })
  describe('signin', ()=>{
    it('should return exception when user not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null)
      const signinBody: SigninBodyDto = {
        email: 'test@gmail.com',
        password: '123456'
      }
      await authService.signin(signinBody.email, signinBody.password).catch(e=>{
        expect(e).toMatchObject({message: 'Password or email invalid'})
      })
    })
    it('should return exception when user password incorrect', async () => {
      const user = TestUtil.getUserValid()
      mockPrismaService.user.findFirst.mockResolvedValue(user)
      mockCryptographyUtil.comparePassword.mockReturnValue(false)
      const signinBody: SigninBodyDto = {
        email: 'test@gmail.com',
        password: '123456'
      }
      await authService.signin(signinBody.email, signinBody.password).catch(e=>{
        expect(e).toMatchObject({message: 'Password or email invalid'})
      })
    })
    it('should authenticated user', async () => {
      const user = TestUtil.getUserValid()
      const refreshToken = TestUtil.getRefreshTokenValid()
      const token = '123456'

      mockPrismaService.user.findFirst.mockResolvedValue(user)
      mockPrismaService.refreshToken.create.mockResolvedValue(refreshToken)
      mockTokenUtil.generateRefreshToken.mockReturnValue(refreshToken)
      mockTokenUtil.generateToken.mockReturnValue(token)
      mockCryptographyUtil.comparePassword.mockReturnValue(true)


      const signinBody: SigninBodyDto = {
        email: 'test@gmail.com',
        password: '123456'
      } 
      const userAuth = await authService.signin(signinBody.email, signinBody.password)
      expect(userAuth).toMatchObject({
        refreshToken: refreshToken.token,
        accessToken: token
      })
    })
  })
  describe('refresh_token', ()=>{
    it('should refresh token', async () => {
      const user = TestUtil.getUserValid()
      const refreshToken = TestUtil.getRefreshTokenValid()
      const token = '123456'
  
      mockPrismaService.refreshToken.findFirst.mockResolvedValue({
        ...refreshToken,
        user
      })
      mockTokenUtil.validateRefreshToken.mockReturnValue(true)
      mockTokenUtil.generateToken.mockReturnValue(token)
  
      const refreshTokenCreated = await authService.refreshToken('123456')
      expect(refreshTokenCreated).toMatchObject({
        refreshToken: refreshToken.token,
        accessToken: token
      })
    })
    it('should return a exception case token not found', async () => {  
      mockPrismaService.refreshToken.findFirst.mockResolvedValue(null)
  
      await authService.refreshToken('123456').catch(e=>{
        expect(e).toMatchObject({message: 'Refresh token is not in database'})
      })
    })
    it('should return a exception case token invalid', async () => {
      const user = TestUtil.getUserValid()
      const refreshToken = TestUtil.getRefreshTokenValid()
  
      mockPrismaService.refreshToken.findFirst.mockResolvedValue({
        ...refreshToken,
        user
      })
      mockTokenUtil.validateRefreshToken.mockReturnValue(false)
  
      await authService.refreshToken('123456').catch(e=>{
        expect(e).toMatchObject({message: 'Refresh token was expired. Please make a new signin request'})
      })
    })
  })
});
