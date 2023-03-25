import {
  BadRequestException,
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
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { AppService } from './app.service';
import { Roles } from './decorators/roles.decorator';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ExcludeNullInterceptor } from './interceptors/exclude-null.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
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
  @Roles('admin')
  @UseInterceptors(LoggingInterceptor)
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

  @Get('roles/:id')
  @Roles('admin')
  @UseInterceptors(TransformInterceptor)
  getRoles() {
    console.log('Im logging inside the handler');
    return this.appService.testRoleGuard('roles');
  }

  @Get('exclude-null')
  @UseInterceptors(ExcludeNullInterceptor)
  testExcludeNullInterceptor() {
    return null;
  }

  @Get('error-interceptor')
  @UseInterceptors(ErrorInterceptor)
  testErrorInterceptor() {
    throw new BadRequestException('Bad request');
  }

  @Get('timeout')
  @UseInterceptors(TimeoutInterceptor)
  testTimeout() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success');
      }, 6000);
    });
  }
}
