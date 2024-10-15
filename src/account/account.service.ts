import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';
import { Player } from 'src/players/player.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account, 'gameConnection')
        private accountRepository: Repository<Account>,
        @InjectRepository(Player, 'gameConnection')
        private playerRepository: Repository<Player>,
    ) { }

    async findAll() {
        return await this.accountRepository.find({
            select: ['id', 'name', 'email'],
        });
    }

    async findOneOrFail(options: FindOneOptions<Account>) {
        try {
            return await this.accountRepository.findOneOrFail(options);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    async store(data: CreateAccountDto) {
        const account = await this.accountRepository.create(data);
        return await this.accountRepository.save(account);
    }

    async update(id: number, data: UpdateAccountDto) {
        const account = await this.findOneOrFail({ where: { id } });
        const mergedAccount = this.accountRepository.merge(account, data);
        return await this.accountRepository.save(mergedAccount);
    }

    async destroy(id: number) {
        await this.accountRepository.findOneOrFail({ where: { id } });
        this.accountRepository.softDelete(id);
    }

    async createAccountWithPlayer(data: CreateAccountDto): Promise<{ account: Account; player: Player }> {
      const queryRunner = this.accountRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    
      try {
   
        const existingAccount = await this.accountRepository.findOne({ where: { email: data.email } });
        if (existingAccount) {
          throw new BadRequestException('Account with this email already exists');
        }
    
        const existingPlayer = await this.playerRepository.findOne({ where: { name: data.player.name } });
        if (existingPlayer) {
          throw new BadRequestException('Player with this name already exists');
        }
    
        const account = this.accountRepository.create({
          email: data.email,
          password: data.password,
          name: data.name,
          country: data.country,
        });
    
        const savedAccount = await queryRunner.manager.save(account);
    
        const player = this.playerRepository.create({
          ...data.player,
          account: savedAccount, 
        });
    
        const savedPlayer = await queryRunner.manager.save(player);
    
        await queryRunner.commitTransaction();
    
        return { account: savedAccount, player: savedPlayer };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
    
}
