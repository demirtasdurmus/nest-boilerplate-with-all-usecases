import { ModuleMetadata } from '@nestjs/common';

export interface BcryptOptions {
  saltRounds?: number;
}

export interface BcryptAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject: any[];
  useFactory: (service: any) => Promise<BcryptOptions> | BcryptOptions;
}
