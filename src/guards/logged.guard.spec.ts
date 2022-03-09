import { TokenUtil } from 'src/utils/token.util';
import { LoggedGuard } from './logged.guard';

describe('LoggedGuard', () => {
  let tokenUtil: TokenUtil;
  let loggedGuard: LoggedGuard;
 
  beforeEach(() => {
    tokenUtil = new TokenUtil();
    loggedGuard = new LoggedGuard(tokenUtil)
  });

  it('should be defined', () => {
    expect(loggedGuard).toBeDefined();
  });
});
