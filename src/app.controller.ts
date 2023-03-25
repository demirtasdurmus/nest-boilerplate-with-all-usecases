import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('dynamic')
  getDynamicData() {
    return this.appService.testDynamicModule();
  }

  @Get('exception')
  getException() {
    return this.appService.testHttpExeption();
  }

  @Get('pipes/:id')
  getPipes(@Param('id', ParseUUIDPipe) id: string) {
    return this.appService.testParsePipe(id);
  }
}
