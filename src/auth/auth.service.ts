import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Account } from 'src/account/account.entity';
import { AccountService } from 'src/account/account.service';
import { AdminAccount } from '../Admin Account/admin-account.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,

    @InjectRepository(AdminAccount, 'websiteConnection')
    private adminAccountRepository: Repository<AdminAccount>,
  ) {}

  // Method to log in the user and include isGodAccount in the JWT
  async login(user: any) {
    // Check if the user has an AdminAccount with god_account: true
    const adminAccount = await this.adminAccountRepository.findOne({
      where: { account_id: user.id, god_account: true },
    });

    const isGodAccount = !!adminAccount; // If found, set isGodAccount to true
    this.logger.debug(`God account status for account ${user.id}: ${isGodAccount}`);

    // Include isGodAccount in the JWT payload
    const payload = { sub: user.id, email: user.email, isGodAccount };

    this.logger.debug(`JWT payload before signing: ${JSON.stringify(payload)}`);

    return {
      token: this.jwtService.sign(payload), // Sign the token with the payload
    };
  }

  // Method to validate the user by email and password
  async validateAccount(email: string, password: string) {
    let account: Account;
    try {
      account = await this.accountService.findOneOrFail({ where: { email } });
      this.logger.debug(`Found account for: ${email}`);
    } catch (error) {
      this.logger.debug(`No account found for: ${email}`);
      return null;
    }

    // Verify the password using argon2
    const isPasswordValid = await argon2.verify(account.password, password);

    if (!isPasswordValid) {
      this.logger.debug(`Invalid password for account: ${email}`);
      return null;
    }

    return account; // Return the account after successful validation
  }

  // New method to verify if the account is a god account
  async logGodAccount(accountId: number): Promise<boolean> {
    const adminAccount = await this.adminAccountRepository.findOne({
      where: { account_id: accountId, god_account: true },
    });

    if (adminAccount) {
      this.logger.debug(`Account ${accountId} is a god account.`);
      return true;
    } else {
      this.logger.debug(`Account ${accountId} is NOT a god account.`);
      return false;
    }
  }
}
