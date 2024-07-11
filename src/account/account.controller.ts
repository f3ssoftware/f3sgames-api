import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('account')

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 200, description: 'Account created.' })
  @ApiResponse({ status: 404, description: 'Create problem.' })
  async store(@Body() body: CreateAccountDto){
    return await this.accountService.store(body);
  }

  @Get()
  @ApiOperation({ summary: 'Find all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts found.' })
  @ApiResponse({ status: 404, description: 'Accounts not found.' })
  @UseGuards(AuthGuard('jwt'))
  async index(){
    return await this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one account by id' })
  @ApiResponse({ status: 200, description: 'Account found.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @UseGuards(AuthGuard('jwt'))
  async indexOf(@Param("id") id: number){
    return await this.accountService.findOneOrFail({where: {id}});
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account update successfully.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param("id") id: number,
    @Body() body: UpdateAccountDto,  
  ){
    return await this.accountService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, description: 'Account deleted.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param("id") id: number){
    await this.accountService.destroy(id);
  }
}