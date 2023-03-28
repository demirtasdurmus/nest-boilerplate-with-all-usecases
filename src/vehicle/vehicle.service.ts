import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicle } from './interfaces/vehicle.interface';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // this is to make native queries to the db
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async testNativeQuery(): Promise<any> {
    return this.connection.db.collection('vehicles').find({}).toArray();
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<IVehicle> {
    return this.vehicleModel.create(createVehicleDto);
  }

  async findAll(): Promise<IVehicle[]> {
    return this.vehicleModel.find({}).exec();
  }

  async findOne(id: string): Promise<IVehicle | null> {
    return this.vehicleModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<IVehicle | null> {
    return this.vehicleModel.findByIdAndUpdate({ _id: id }, updateVehicleDto, { new: true });
  }

  async remove(id: string): Promise<IVehicle | null> {
    return this.vehicleModel.findByIdAndDelete({ _id: id }, { new: true });
  }
}
