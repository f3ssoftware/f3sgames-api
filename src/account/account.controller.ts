import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account';
import { UpdateAccountDto } from './dto/update-account';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('account')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAccountDto })
  async store(@Body() body: CreateAccountDto) {
    return await this.accountService.store(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async index() {
    return await this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the account' })
  async indexOf(@Param('id') id: number) {
    return await this.accountService.findOneOrFail({ where: { id } });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiResponse({ status: 200, description: 'Account updated successfully.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiBody({ type: UpdateAccountDto })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the account' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateAccountDto,
  ) {
    return await this.accountService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the account' })
  async destroy(@Param('id') id: number) {
    await this.accountService.destroy(id);
  }
}
