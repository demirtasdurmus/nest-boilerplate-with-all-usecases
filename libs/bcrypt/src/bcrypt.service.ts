import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants/salt-rounds.constant';
import { BcryptOptions } from './interfaces/bcrypt-options.interface';

interface IBcryptService {
  hash(hashString: string): Promise<string>;
  compare(password: string, hashPassword: string): Promise<boolean>;
}

@Injectable()
export class BcryptService implements IBcryptService {
  constructor(@Inject(SALT_ROUNDS) private readonly bcryptOptions: BcryptOptions) {}

  async hash(hashString: string): Promise<string> {
    const rounds = this.bcryptOptions.saltRounds || 10;
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(hashString, salt);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
