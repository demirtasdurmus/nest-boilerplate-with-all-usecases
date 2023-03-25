/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, ArgumentMetadata, UnauthorizedException } from '@nestjs/common';

export interface PipeUser {
  id: string;
  name: string;
}

@Injectable()
export class UserById implements PipeTransform<string, Promise<PipeUser>> {
  // constructor (private readonly userService: UserService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<PipeUser> {
    // const user = await this.userService.getById(id);
    // if (!user) throw new UnauthorizedException();
    return { id: '', name: '' };
  }
}
