import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';

import { Account } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private accountService: AccountService, private jwtService: JwtService) { }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateAccount(email: string, password: string) {
    let account: Account;
    try {
      account = await this.accountService.findOneOrFail({ where: { email } });
      this.logger.debug(`Finded account for: ${email}`);
    } catch (error) {
      this.logger.debug(`Not founded account for: ${email}`);
      return null;
    }

    this.logger.debug(`Stored password: ${account.password}`);
    this.logger.debug(`Given password: ${password}`);

    const isPasswordValid = await argon2.verify(account.password, password);

    this.logger.debug(`Valid password: ${isPasswordValid}`);
    if (!isPasswordValid) return null;
    return account;
  }
}
