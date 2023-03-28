import { Test, TestingModule } from '@nestjs/testing';
import { LazyTestService } from './lazy-test.service';

describe('LazyTestService', () => {
  let service: LazyTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LazyTestService],
    }).compile();

    service = module.get<LazyTestService>(LazyTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
