import { Test, TestingModule } from '@nestjs/testing';
import { TokenUtil } from './token.util';

describe('TokenUtil', () => {
  let provider: TokenUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenUtil],
    }).compile();

    provider = module.get<TokenUtil>(TokenUtil);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
