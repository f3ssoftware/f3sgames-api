import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateNewsTickerDto } from './dto/create-news-ticker.dto';
import { UpdateNewsTickerDto } from './dto/update-news-ticker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsTicker } from './entities/news-ticker.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Account } from 'src/account/account.entity';
import { AdminAccount } from '../Admin Account/admin-account.entity';

@Injectable()
export class NewsTickerService {
  constructor(
    @InjectRepository(NewsTicker, 'websiteConnection')
    private newsTickerRepository: Repository<NewsTicker>,
    
    @InjectRepository(Account, 'gameConnection') 
    private accountRepository: Repository<Account>,

    @InjectRepository(AdminAccount, 'websiteConnection') 
    private adminAccountRepository: Repository<AdminAccount>,
  ) {}

    async create(newsTickerData: CreateNewsTickerDto, accountId: number) {
   
      const account = await this.accountRepository.findOne({ where: { id: accountId } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
  
      const admin = await this.adminAccountRepository.findOne({ where: { account_id: accountId } });
      if (!admin) {
        throw new UnauthorizedException('Only admin accounts can create news tickers');
      }
  
      const activeNewsTickers = await this.newsTickerRepository.find({
        where: { enabled: true },
        order: { createdAt: 'ASC' }
      });
  
      if (activeNewsTickers.length >= 5) {
        const oldestTicker = activeNewsTickers[0];
        oldestTicker.enabled = false;
        await this.newsTickerRepository.save(oldestTicker);
      }

      const newsTicker = this.newsTickerRepository.create({ ...newsTickerData, enabled: true });
      return await this.newsTickerRepository.save(newsTicker);
    }
  
  async findAll() {

    return await this.newsTickerRepository.find({
      where: { enabled: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(options: FindOneOptions<NewsTicker>) {
    try {
        return await this.newsTickerRepository.findOneOrFail(options);
    }catch(error){
      throw new NotFoundException(error.message);
    }
    
  }

 async  update(id: number, updateNewsTickerData: UpdateNewsTickerDto) {
  const newsTicker = await this.findOne({where: {id}}); 
  this.newsTickerRepository.merge(newsTicker, updateNewsTickerData);
    return await this.newsTickerRepository.save(newsTicker);
  }

  async remove(id: number): Promise<UpdateResult> {
    await this.newsTickerRepository.findOne({ where: { id } });
    return this.newsTickerRepository.softDelete(id);
  }
 
}
