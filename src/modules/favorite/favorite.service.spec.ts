import { Test, TestingModule } from '@nestjs/testing';
import { CreateFavoriteDto } from 'src/dtos/favorite.dto';
import { PrismaService } from 'src/prisma.service';
import { TestUtil } from 'src/utils/test.util';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  const mockPrismaService = {
    url: {
      findFirst: jest.fn(),
    },
    favorite: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile();

    favoriteService = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(favoriteService).toBeDefined();
  });

  describe("register favorite", ()=>{
    it("should register a new favorite without user", async ()=>{
      const favorite = TestUtil.getFavoriteValid();
      const url = TestUtil.getUrlValidWithoutUser();
      mockPrismaService.url.findFirst.mockResolvedValue(url);
      mockPrismaService.favorite.create.mockResolvedValue(favorite)

      const newfavorite: CreateFavoriteDto = {
        urlId: '123456',
      }
      const favoriteCreated = await favoriteService.create(newfavorite)
      expect(favoriteCreated).toEqual(favorite)
    })
    it("should register a new favorite with user", async ()=>{
      const favorite = TestUtil.getFavoriteValid()
      mockPrismaService.favorite.create.mockResolvedValue(favorite)

      const newfavorite: CreateFavoriteDto = {
        urlId: '123456'
      }
      const favoriteCreated = await favoriteService.create(newfavorite)
      expect(favoriteCreated).toEqual(favorite)
    })
  })
  describe("delete favorite", ()=>{
    it("should delete favorite", async ()=>{
      const user = TestUtil.getUserValid()
      const favorite = TestUtil.getFavoriteValid()
      mockPrismaService.favorite.findFirst.mockResolvedValue(favorite)
      mockPrismaService.favorite.delete.mockResolvedValue(favorite)

      const favoriteDeleted = await favoriteService.delete(favorite.id, user.id)
      expect(favoriteDeleted).toEqual(favorite)
    })
    it("should return exception when favorite not found", async ()=>{
      const user = TestUtil.getUserValid()
      const favorite = TestUtil.getFavoriteValid()
      mockPrismaService.favorite.findFirst.mockResolvedValue(null)
      mockPrismaService.favorite.delete.mockResolvedValue(favorite)

      await favoriteService.delete(favorite.id, user.id).catch(e=>{
        expect(e).toMatchObject({message: 'Favorite not found'})
      })
    })
  })
});
