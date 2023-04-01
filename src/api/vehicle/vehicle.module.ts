/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/config/config.interface';

@Module({
  imports: [
    // forwardRef(()=> CircularDependentModule), // solving issues with circular dependency

    /*this is the solution to the pre save hook issue */
    MongooseModule.forFeatureAsync([
      {
        name: Vehicle.name,
        useFactory: () => {
          const schema = VehicleSchema;
          schema.pre('save', function (next) {
            console.log('pre save hook');
            next();
          });
          schema.pre(/^find/, function (next) {
            this.find({ active: { $ne: false } });
            next();
          });
          return schema;
        },
      },
    ]),

    /* Standard*/
    // MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
