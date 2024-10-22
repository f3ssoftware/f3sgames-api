import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Authorization success.' })
  @ApiResponse({ status: 404, description: 'Authorization problem.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Example request',
        value: {
          email: 'test@example.com',
          password: '428181Abc#',
        },
      },
    },
  })
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login-into-admin-page')
  @ApiOperation({ summary: 'God account login' })
  @ApiResponse({ status: 200, description: 'God account logged in successfully.' })
  @ApiResponse({ status: 403, description: 'Access denied. Not a god account.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  async loginIntoAdminPage(@Req() req: any) {
    const { email, password } = req.body;

    const account = await this.authService.validateAccount(email, password);

    if (!account) {
      return { message: 'Invalid credentials', statusCode: 401 };
    }

    const isGodAccount = await this.authService.logGodAccount(account.id);

    if (!isGodAccount) {
      return { message: 'You are not authorized to access this page.', statusCode: 403 };
    }

    const jwt = await this.authService.login(account); 

    return {
      message: 'Request allowed.',
      token: jwt.token,  
      accountId: account.id, 
    };
  }
}
