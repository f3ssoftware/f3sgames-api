import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async store(@Body() body: CreateAccountDto){
    return await this.accountService.store(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async index(){
    return await this.accountService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async indexOf(@Param("id") id: number){
    return await this.accountService.findOneOrFail({where: {id}});
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param("id") id: number,
    @Body() body: UpdateAccountDto,  
  ){
    return await this.accountService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param("id") id: number){
    await this.accountService.destroy(id);
  }
}