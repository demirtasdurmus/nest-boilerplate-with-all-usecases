import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({})
export class TestModule {
  public static forRoot(): DynamicModule {
    return {
      module: TestModule,
      providers: [],
    };
  }
}
