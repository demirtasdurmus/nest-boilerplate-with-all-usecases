import { Controller, Get, HttpStatus, Param, ParseEnumPipe, ParseUUIDPipe, Query } from '@nestjs/common';

import { AppService } from './app.service';

export enum STATUS {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
}

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
  getPipes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status', new ParseEnumPipe(STATUS, { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) status: STATUS,
  ) {
    return this.appService.testParsePipe(id, status);
  }
}
