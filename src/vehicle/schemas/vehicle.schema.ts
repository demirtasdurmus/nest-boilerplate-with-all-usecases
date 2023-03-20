import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IVehicle } from '../interfaces/vehicle.interface';

@Schema()
export class Vehicle implements IVehicle {
  @Prop({ required: true })
  type: string;

  @Prop()
  make: string;

  @Prop()
  model: string;

  @Prop()
  year: string;

  @Prop()
  price: number;

  @Prop()
  km: number;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({ default: false })
  approved: boolean;
}

export type VehicleDocument = HydratedDocument<Vehicle>;

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
