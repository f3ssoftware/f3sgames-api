import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
  @Post('login') @ApiOperation({ summary: 'Authorization path' })
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }


}
