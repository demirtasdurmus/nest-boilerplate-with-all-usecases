import { IVehicle } from './vehicle.interface';

export type TCreateVehicleRes = Required<Pick<IVehicle, 'id' | 'type' | 'approved' | 'createdAt' | 'updatedAt'>> &
  Partial<IVehicle>;
