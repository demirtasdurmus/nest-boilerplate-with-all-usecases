import { DynamicModule, Global, Module } from '@nestjs/common';
import { DynamicTestService } from './dynamic-test.service';

@Global()
@Module({})
export class DynamicTestModule {
  public static forRoot(arg: string): DynamicModule {
    const dynamicTestProvider = new DynamicTestService(arg);
    return {
      module: DynamicTestModule,
      providers: [{ provide: DynamicTestService, useValue: dynamicTestProvider }],
      exports: [DynamicTestService],
    };
  }
}
