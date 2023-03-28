import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { DynamicTestService } from './dynamic-test.service';
import { TEST_OPTIONS } from './options.constant';

@Global()
@Module({})
export class DynamicTestModule {
  public static forRoot(options: object): DynamicModule {
    const optionsProvider: Provider<object | unknown> = {
      provide: TEST_OPTIONS,
      useValue: options || {},
    };
    return {
      module: DynamicTestModule,
      providers: [DynamicTestService, optionsProvider],
      exports: [DynamicTestService],
    };
  }
}
