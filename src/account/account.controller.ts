import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async store(@Body() body: CreateAccountDto){
    return await this.accountService.store(body);
  }

  @Get()
  async index(){
    return await this.accountService.findAll();
  }

  @Get(':id')
  async indexOf(@Param("id") id: number){
    return await this.accountService.findOneOrFail({where: {id}});
  }

  @Put(':id')
  async update(
    @Param("id") id: number,
    @Body() body: UpdateAccountDto,  
  ){
    return await this.accountService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param("id") id: number){
    await this.accountService.destroy(id);
  }
}