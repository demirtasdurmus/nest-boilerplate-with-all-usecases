import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { TCreateVehicleRes } from './interfaces/vehicle-response.interface';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(@InjectModel(Vehicle.name) private readonly vehicleModel: Model<VehicleDocument>) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<TCreateVehicleRes> {
    const vehicle = await this.vehicleModel.create(createVehicleDto);

    const res: TCreateVehicleRes = {
      id: vehicle.id,
      type: vehicle.type,
      approved: vehicle.approved,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      km: vehicle.km,
      price: vehicle.price,
      lat: vehicle.lat,
      lng: vehicle.lng,
    };
    return res;
  }

  findAll() {
    return `This action returns all vehicle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
