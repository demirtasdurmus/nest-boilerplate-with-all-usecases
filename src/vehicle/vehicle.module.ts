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
    // MongooseModule.forFeatureAsync([  // this is the solution to the pre save hook issue
    //   {
    //     name: Vehicle.name,
    //     useFactory: (config: ConfigService<IConfig>) => {
    //       const schema = VehicleSchema;
    //       schema.pre('save', function (next) {
    //         console.log('pre save hook', config.get('DB_NAME', { infer: true }));
    //         next();
    //       });
    //       return schema;
    //     },
    //     inject: [ConfigService],
    //   },
    // ]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
