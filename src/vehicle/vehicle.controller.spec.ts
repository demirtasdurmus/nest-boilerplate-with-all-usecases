import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
const moduleMocker = new ModuleMocker(global);

describe('VehicleController', () => {
  let controller: VehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [VehicleService],
    })
      .useMocker((token) => {
        const results = ['test1', 'test2'];
        if (token === VehicleService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<VehicleController>(VehicleController);
  });

  // const result = ['test'];
  // jest.spyOn(vehicleService, 'findAll').mockImplementation(() => result);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
