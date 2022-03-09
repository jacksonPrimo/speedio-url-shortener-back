import { CanActivate, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUrlDto } from 'src/dtos/url.dto';
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
});
