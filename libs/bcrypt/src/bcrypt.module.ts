import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { SALT_ROUNDS } from './constants/salt-rounds.constant';
import { BcryptAsyncOptions, BcryptOptions } from './interfaces/bcrypt-options.interface';

@Global()
@Module({})
export class BcryptModule {
  public static register(options: BcryptOptions): DynamicModule {
    const optionsProvider: Provider<BcryptOptions | unknown> = {
      provide: SALT_ROUNDS,
      useValue: options || {},
    };

    return {
      module: BcryptModule,
      providers: [BcryptService, optionsProvider],
      exports: [BcryptService],
    };
  }

  public static registerAsync(options: BcryptAsyncOptions): DynamicModule {
    const optionsProvider: Provider<BcryptOptions | unknown> = {
      provide: SALT_ROUNDS,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    return {
      module: BcryptModule,
      imports: options.imports,
      providers: [BcryptService, optionsProvider],
      exports: [BcryptService],
    };
  }
}
