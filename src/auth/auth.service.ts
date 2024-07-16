import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as argon2 from 'argon2';

import { Account } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
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
    } catch (error) {
      return null;
    }

    const isPasswordValid = await argon2.verify(account.password, password);
    if (!isPasswordValid) return null;
    return account;
  }
}
