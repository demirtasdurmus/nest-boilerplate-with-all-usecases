import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamicTestModule } from './lib/dynamic-test.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'vehicles',
      authSource: 'admin',
      socketTimeoutMS: 15000,
      connectionFactory(connection) {
        console.log(`Connected to ${connection.name} successfully`);
        return connection;
      },
    }),
    DynamicTestModule.forRoot('Im for dynamic root'),
    VehicleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
