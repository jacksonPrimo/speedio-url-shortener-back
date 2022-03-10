import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlDto } from 'src/dtos/url.dto';
import { PrismaService } from 'src/prisma.service';
import { TestUtil } from 'src/utils/test.util';
import { UrlService } from './url.service';

describe('UrlService', () => {
  let urlService: UrlService;
  const mockPrismaService = {
    url: {
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
        UrlService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });
  describe("find url", ()=>{
    it("find url by id", async ()=>{
      const url = TestUtil.getUrlValidWithoutUser()
      const urlWithAddedView = {
        ...url,
        view: url.views + 1
      }
      mockPrismaService.url.findFirst.mockResolvedValue(url)
      mockPrismaService.url.update.mockResolvedValue(urlWithAddedView)

      const urlFound = await urlService.find(url.id)
      expect(urlFound).toEqual(url)
    })
    it("should return exception when url not found", async ()=>{
      const url = TestUtil.getUrlValidWithoutUser()
      mockPrismaService.url.findFirst.mockResolvedValue(null)

      await urlService.find(url.id).catch(e=>{
        expect(e).toMatchObject({message: 'Url not found'})
      })
    })
  })
  describe("register url", ()=>{
    it("should register a new url without user", async ()=>{
      const url = TestUtil.getUrlValidWithoutUser()
      mockPrismaService.url.create.mockResolvedValue(url)

      const newUrl: CreateUrlDto = {
        originalUrl: url.originalUrl
      }
      const urlCreated = await urlService.create(newUrl)
      expect(urlCreated).toEqual(url)
    })
    it("should register a new url with user", async ()=>{
      const url = TestUtil.getUrlValidWithUser()
      mockPrismaService.url.create.mockResolvedValue(url)

      const newUrl: CreateUrlDto = {
        originalUrl: url.originalUrl
      }
      const urlCreated = await urlService.create(newUrl)
      expect(urlCreated).toEqual(url)
    })
  })
  describe("list urls by user", ()=>{
    it("should list urls by user", async ()=>{
      const user = TestUtil.getUserValid()
      const url = TestUtil.getUrlValidWithUser()
      mockPrismaService.url.findMany.mockResolvedValue([url, url])

      const urlsFound = await urlService.list(user.id)
      expect(urlsFound).toHaveLength(2)
      expect(urlsFound[0].userId).toEqual(user.id)
    })
    it("should list urls by user", async ()=>{
      const user = TestUtil.getUserValid()
      mockPrismaService.url.findMany.mockResolvedValue(null)

      await urlService.list(user.id).catch(e=>{
        expect(e).toMatchObject({message: 'Urls not found for this user'})
      })
    })
  })
  describe("list top 100 urls viweds", ()=>{
    it("should list urls", async ()=>{
      const url01 = {
        ...TestUtil.getUrlValidWithUser(),
        views: 3
      }
      const url02 = {
        ...TestUtil.getUrlValidWithUser(),
        views: 2
      }
      const url03 = {
        ...TestUtil.getUrlValidWithUser(),
        views: 1
      }
      mockPrismaService.url.findMany.mockResolvedValue([url01, url02, url03])

      const urlsFound = await urlService.listTop100()
      expect(urlsFound).toHaveLength(3)
    })
    it("should return exception when url not found", async ()=>{
      
      mockPrismaService.url.findMany.mockResolvedValue(null)

      await urlService.listTop100().catch(e=>{
        expect(e).toMatchObject({message: 'Urls not found'})
      })
    })
  })
  describe("delete url", ()=>{
    it("should delete url", async ()=>{
      const user = TestUtil.getUserValid()
      const url = TestUtil.getUrlValidWithUser()
      mockPrismaService.url.findFirst.mockResolvedValue(url)
      mockPrismaService.url.delete.mockResolvedValue(url)

      const urlDeleted = await urlService.delete(url.id, user.id)
      expect(urlDeleted).toEqual(url)
    })
    it("should return exception when url not found", async ()=>{
      const user = TestUtil.getUserValid()
      const url = TestUtil.getUrlValidWithUser()
      mockPrismaService.url.findFirst.mockResolvedValue(null)
      mockPrismaService.url.delete.mockResolvedValue(url)

      await urlService.delete(url.id, user.id).catch(e=>{
        expect(e).toMatchObject({message: 'Url not found'})
      })
    })
  })
});
