import { CanActivate, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggedGuard } from 'src/guards/logged.guard';
import { TestUtil } from 'src/utils/test.util';
import { TokenUtil } from 'src/utils/token.util';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

describe('UrlController', () => {
  let urlController: UrlController;
  const mockUrlService = {
    create: jest.fn(),
    delete: jest.fn(),
  }
  const mockTokenUtil = {
    decodeToken: jest.fn(),
    validateToken: jest.fn(),
  }
  beforeEach(async () => {
    const mockGuard: CanActivate = { 
      canActivate: jest.fn(() => true)
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UrlController,
      ],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService
        },
        {
          provide: TokenUtil,
          useValue: mockTokenUtil
        },
        { 
          provide: LoggedGuard,
          useValue: mockGuard
        }
      ]
    })
    .overrideGuard(LoggedGuard)
    .useValue(mockGuard)
    .compile();

    urlController = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(urlController).toBeDefined();
  });
  describe('create a url', ()=>{
    it('should be return a exception case token is invalid', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token not valid', 401);
      })
      await urlController.create({authorization: "Bearer token"}, {
        originalUrl: "example.com"
      }).catch(e=>{
        expect(e.message).toEqual('token not valid')
      })
    })
    it('should be return a exception case token is expired', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token expired', 401);
      })
      await urlController.create({authorization: "Bearer token"}, {
        originalUrl: "example.com"
      }).catch(e=>{
        expect(e.message).toEqual('token expired')
      })
    })
    it('should be create a url', async ()=>{
      const url = TestUtil.getUrlValidWithUser()
      mockTokenUtil.validateToken.mockResolvedValue(null)
      mockTokenUtil.decodeToken.mockResolvedValue({id: url.userId})
      mockUrlService.create.mockResolvedValue(url)
      const urlCreated = await urlController.create(
        { authorization: "Bearer token" }, 
        { originalUrl: url.originalUrl }
      )
      expect(urlCreated).toEqual(url)
    })
  })
  describe('delete a url', ()=>{
    it('should be return a exception case token is invalid', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token not valid', 401);
      })
      await urlController.delete({id: 'urlId'}, {authorization: "Bearer token"}).catch(e=>{
        expect(e.message).toEqual('token not valid')
      })
    })
    it('should be return a exception case token is expired', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token expired', 401);
      })
      await urlController.delete({id: 'urlId'}, {authorization: "Bearer token"}).catch(e=>{
        expect(e.message).toEqual('token expired')
      })
    })
    it('should be delete a url', async ()=>{
      const url = TestUtil.getUrlValidWithUser()
      mockTokenUtil.validateToken.mockResolvedValue(null)
      mockTokenUtil.decodeToken.mockResolvedValue({id: url.userId})
      mockUrlService.delete.mockResolvedValue(url)
      const urlCreated = await urlController.delete(
        { id: url.originalUrl },
        { authorization: "Bearer token" }, 
      )
      expect(urlCreated).toEqual(url)
    })
  })
});
