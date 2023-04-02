/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  DefaultValuePipe,
  FileTypeValidator,
  Get,
  Header,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  Scope,
  Sse,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
  MessageEvent,
} from '@nestjs/common';
import { Expose } from 'class-transformer';

import { AppService } from './app.service';
import { CombinedAuth } from '../decorators/combined-auth.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CurrentUserDto } from '../decorators/current-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { ExcludeNullInterceptor } from '../interceptors/exclude-null.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { joiTestSchema } from '../pipes/joi-test.schema';
import { JoiValidation } from '../pipes/joi-validation.pipe';
import { PipeUser, UserById } from '../pipes/user-by-id.pipe';
import { Request, Response } from 'express';
import { Cookies } from '../decorators/cookies.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileValidator } from '../validators/custom-file.validator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { interval, map, Observable } from 'rxjs';

export enum STATUS {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
}

export class TestSerializeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Controller({
  path: '/',
  scope: Scope.DEFAULT, // not necessary actually, others are Scope.REQUEST and Scope.TRANSIENT
  // version: '1',
  // version: VERSION_NEUTRAL // doesn't care about version
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Version('1')
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
    return this.appService.testHttpException();
  }

  @Get('pipes')
  @UsePipes(new JoiValidation(joiTestSchema))
  getValidationPipes(@Body() data: any) {
    return this.appService.testJoiValidationPipe(data);
  }

  @Get('pipes/:id')
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

  @Get('user')
  testUserParamDecorator(
    @CurrentUser('id', new ValidationPipe({ validateCustomDecorators: true })) user: CurrentUserDto,
  ) {
    return user;
  }

  @Get('combined-auth')
  @CombinedAuth('admin')
  testCombinedAuth() {
    return 'success';
  }

  @Get('array-types')
  parseArrayTypes(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    return ids;
  }

  @Get('cache')
  @UseInterceptors(CacheInterceptor) // enables automatic caching, only GET endpoints are cached by default
  // @CacheKey('custom_key') // custom key for caching, can be used with @CacheTTL()
  // @CacheTTL(10) // custom TTL for caching (in seconds
  testCache() {
    return this.appService.testCache();
  }

  @Get('serialize')
  @Serialize(TestSerializeDto)
  testSerialize() {
    return this.appService.testSerializeInterceptor();
  }

  @Get('cron')
  manageCron() {
    return this.appService.manageCron();
  }

  @Get('queue')
  manageQueue() {
    return this.appService.testQueue();
  }

  @Get('get-cookies')
  getCookies(@Req() request: Request, @Cookies('key') cookie: string) {
    console.log('decorator cookie: ', cookie);
    return request.cookies['key'] || request.signedCookies['key'];
  }

  @Get('set-cookies')
  setCookies(@Res({ passthrough: true }) response: Response) {
    response.cookie('key', 'value', { signed: true });
  }

  @Get('events')
  testEventEmitter() {
    return this.appService.testEventEmitter();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // dest: 'uploads' // saves the file to the uploads folder
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // in bytes
          new FileTypeValidator({ fileType: 'image/jpeg' }),
          new CustomFileValidator({ key: 'value' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file.buffer.toString('hex');
  }

  @Get('stream')
  // @Header('Content-Type', 'application/json')
  // @Header('Content-Disposition', 'attachment; filename="package.json"')
  getStreamFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    // res.set({
    //   'Content-Type': 'application/json',
    //   'Content-Disposition': 'attachment; filename="package.json"',
    // });
    return new StreamableFile(file);
  }

  @Get('http')
  testHttpService() {
    return this.appService.testHTTPService();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}

/* Client side conf for subscribing sse*/
// const eventSource = new EventSource('/sse');
// eventSource.onmessage = ({ data }) => {
//   console.log('New message', JSON.parse(data));
// };
