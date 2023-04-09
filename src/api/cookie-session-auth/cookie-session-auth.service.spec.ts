import { Test, TestingModule } from '@nestjs/testing';
import { CookieSessionAuthService } from './cookie-session-auth.service';

describe('CookieSessionAuthService', () => {
  let service: CookieSessionAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieSessionAuthService],
    }).compile();

    service = module.get<CookieSessionAuthService>(CookieSessionAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
