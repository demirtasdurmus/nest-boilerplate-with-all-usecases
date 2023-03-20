export interface IVehicle {
  id?: string;
  type: string;
  make: string;
  model: string;
  year: string;
  price: number;
  km: number;
  lat: number;
  lng: number;
  approved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
