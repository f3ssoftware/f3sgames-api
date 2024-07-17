import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account, 'gameConnection')
        private accountRepository: Repository<Account>,
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
}
