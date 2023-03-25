import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { joiTestSchema } from './pipes/joi-test.schema';
import { JoiValidation } from './pipes/joi-validation.pipe';
import { PipeUser, UserById } from './pipes/user-by-id.pipe';

export enum STATUS {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
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

  @Get('pipes')
  @UsePipes(new JoiValidation(joiTestSchema))
  getValidationPipes(@Body() data: any) {
    return this.appService.testJoiValidationPipe(data);
  }

  @Get('pipes/:id')
  getPipes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status', new ParseEnumPipe(STATUS, { errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) status: STATUS,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', UserById) user: PipeUser,
  ) {
    return this.appService.testParsePipe(id, status);
  }
}
