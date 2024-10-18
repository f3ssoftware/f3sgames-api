import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAccount } from './admin-account.entity'; // AdminAccount Entity in websiteConnection
import { Player } from '../players/player.entity'; // Player Entity in gameConnection
import { Account } from '../account/account.entity'; // Account Entity in gameConnection

@Injectable()
export class AdminAccountService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminAccount, 'websiteConnection')
    private adminAccountRepository: Repository<AdminAccount>,
    
    @InjectRepository(Player, 'gameConnection')
    private playerRepository: Repository<Player>,

    @InjectRepository(Account, 'gameConnection')
    private accountRepository: Repository<Account>,
  ) {}

  // Automatically triggered when the service is initialized
  async onModuleInit() {
    await this.checkAndConfigureAdminAccounts();
  }

  // Check players with group_id = 6 and update AdminAccount table
  private async checkAndConfigureAdminAccounts() {
    // Finding all players with group_id = 6
    const players = await this.playerRepository.find({
      where: { group_id: 6 },
      relations: ['account'], // Load related account data
    });

    // Loop through each player and check if they need to be configured in AdminAccount
    for (const player of players) {
      const account = player.account;

      // Check if an AdminAccount already exists for this account
      const existingAdminAccount = await this.adminAccountRepository.findOne({
        where: { account_id: account.id },
      });

      // If no AdminAccount exists, create one
      if (!existingAdminAccount) {
        const newAdminAccount = this.adminAccountRepository.create({
          account_id: account.id,
          god_account: true,
        });
        await this.adminAccountRepository.save(newAdminAccount);
      }
    }
  }
}
