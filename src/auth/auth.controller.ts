import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}  
  
  @UseGuards(AuthGuard('local'))
  @Post('login')@ApiOperation({ summary: 'Authorization path' })
  @ApiResponse({ status: 200, description: 'Authorization success.' })
  @ApiResponse({ status: 404, description: 'Authorization problem.' })
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }


}
