import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';

@Injectable()
export class CryptographyUtil {
  private salt: number = 8;

  encryptPassword(password: string) {
    return hashSync(password, this.salt);
  }

  comparePassword(password: string, storedPassword: string) {
    return compareSync(password, storedPassword);
  }
}
