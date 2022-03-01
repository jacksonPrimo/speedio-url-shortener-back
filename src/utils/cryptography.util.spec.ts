import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyUtil } from './cryptography.util';

describe('CryptographyUtil', () => {
  let provider: CryptographyUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptographyUtil],
    }).compile();

    provider = module.get<CryptographyUtil>(CryptographyUtil);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
