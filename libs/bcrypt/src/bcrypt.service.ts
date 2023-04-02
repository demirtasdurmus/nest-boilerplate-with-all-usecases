import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface IBcryptService {
  hash(hashString: string): Promise<string>;
  compare(password: string, hashPassword: string): Promise<boolean>;
}

@Injectable()
export class BcryptService implements IBcryptService {
  private readonly saltRounds = 10;

  async hash(hashString: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(hashString, salt);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
