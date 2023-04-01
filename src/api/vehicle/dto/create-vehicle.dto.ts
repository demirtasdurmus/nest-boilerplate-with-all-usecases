import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  km?: number;

  @IsLatitude()
  @IsOptional()
  lat?: number;

  @IsLongitude()
  @IsOptional()
  lng?: number;
}
