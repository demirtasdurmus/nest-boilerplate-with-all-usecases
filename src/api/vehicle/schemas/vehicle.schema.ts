import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IVehicle } from '../interfaces/vehicle.interface';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Vehicle implements IVehicle {
  @Prop({ required: true })
  type: string;

  @Prop()
  make: string;

  @Prop()
  model: string;

  @Prop()
  year: number;

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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type VehicleDocument = HydratedDocument<Vehicle>;

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
