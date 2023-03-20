import { IVehicle } from './vehicle.interface';

export type TCreateVehicleReq = Required<Pick<IVehicle, 'type'>> &
  Partial<Omit<IVehicle, 'id' | 'approved' | 'createdAt' | 'updatedAt'>>;
