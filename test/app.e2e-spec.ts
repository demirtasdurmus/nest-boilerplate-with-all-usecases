import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { VehicleService } from 'src/api/vehicle/vehicle.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const vehicleService = { findAll: () => ['test'] };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(VehicleService)
      .useValue(vehicleService)
      // .overrideFilter()
      // .useValue()
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
