import { CanActivate, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggedGuard } from 'src/guards/logged.guard';
import { TestUtil } from 'src/utils/test.util';
import { TokenUtil } from 'src/utils/token.util';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

describe('FavoriteController', () => {
  let favoriteController: FavoriteController;

  const mockFavoriteService = {
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
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoriteService
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
    }).compile();

    favoriteController = module.get<FavoriteController>(FavoriteController);
  });

  it('should be defined', () => {
    expect(favoriteController).toBeDefined();
  });

  describe('create a url', ()=>{
    it('should be return a exception case token is invalid', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token not valid', 401);
      })
      await favoriteController.create({authorization: "Bearer token"}, {
        urlId: '123456'
      }).catch(e=>{
        expect(e.message).toEqual('token not valid')
      })
    })
    it('should be return a exception case token is expired', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token expired', 401);
      })
      await favoriteController.create({authorization: "Bearer token"}, {
        urlId: '123456'
      }).catch(e=>{
        expect(e.message).toEqual('token expired')
      })
    })
    it('should be create a url', async ()=>{
      const favorite = TestUtil.getFavoriteValid()
      mockTokenUtil.validateToken.mockResolvedValue(null)
      mockTokenUtil.decodeToken.mockResolvedValue({id: favorite.userId})
      mockFavoriteService.create.mockResolvedValue(favorite)
      const favoriteCreated = await favoriteController.create(
        { authorization: "Bearer token" }, 
        { urlId: favorite.urlId } 
      )
      expect(favoriteCreated).toEqual(favorite)
    })
  })
  describe('delete a favorite', ()=>{
    it('should be return a exception case token is invalid', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token not valid', 401);
      })
      await favoriteController.delete({id: 'urlId'}, {authorization: "Bearer token"}).catch(e=>{
        expect(e.message).toEqual('token not valid')
      })
    })
    it('should be return a exception case token is expired', async ()=>{
      mockTokenUtil.validateToken.mockImplementation(()=>{
        throw new HttpException('token expired', 401);
      })
      await favoriteController.delete({id: 'urlId'}, {authorization: "Bearer token"}).catch(e=>{
        expect(e.message).toEqual('token expired')
      })
    })
    it('should be delete a favorite', async ()=>{
      const favorite = TestUtil.getFavoriteValid()
      mockTokenUtil.validateToken.mockResolvedValue(null)
      mockTokenUtil.decodeToken.mockResolvedValue({id: favorite.userId})
      mockFavoriteService.delete.mockResolvedValue(favorite)
      const favoriteDeleted = await favoriteController.delete(
        { id: favorite.id },
        { authorization: "Bearer token" }
      )
      expect(favoriteDeleted).toEqual(favorite)
    })
  })
});
