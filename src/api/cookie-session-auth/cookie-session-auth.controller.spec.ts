import { Test, TestingModule } from '@nestjs/testing';
import { CookieSessionAuthController } from './cookie-session-auth.controller';

describe('CookieSessionAuthController', () => {
  let controller: CookieSessionAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CookieSessionAuthController],
    }).compile();

    controller = module.get<CookieSessionAuthController>(CookieSessionAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
