import { Controller, Get, Post, Body, Patch, Param, Delete, Header } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicle } from './interfaces/vehicle.interface';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<IVehicle> {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  findAll(): Promise<IVehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @Header('Cache-Control', 'none')
  findOne(@Param('id') id: string): Promise<IVehicle | null> {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto): Promise<IVehicle | null> {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IVehicle | null> {
    return this.vehicleService.remove(id);
  }
}
