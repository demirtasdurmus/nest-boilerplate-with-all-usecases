import { Test, TestingModule } from '@nestjs/testing';
import { PassportAuthService } from './passport-auth.service';

describe('PassportAuthService', () => {
  let service: PassportAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassportAuthService],
    }).compile();

    service = module.get<PassportAuthService>(PassportAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
