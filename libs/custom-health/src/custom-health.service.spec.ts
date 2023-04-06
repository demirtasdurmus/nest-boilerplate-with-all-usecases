import { Test, TestingModule } from '@nestjs/testing';
import { CustomHealthService } from './custom-health.service';

describe('CustomHealthService', () => {
  let service: CustomHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomHealthService],
    }).compile();

    service = module.get<CustomHealthService>(CustomHealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
