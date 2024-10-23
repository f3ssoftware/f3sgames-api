import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { GodAccountGuard } from '../auth/guards/god-account-guard';
import { Coupon } from './coupon.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @UseGuards(GodAccountGuard) /* By using this I guarantee that only admin accounts are allowed to use this endpoint */
  @Post('create')
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        influencerName: { type: 'string', example: 'Doith' },
        influencerEmail: { type: 'string', example: 'djdoith@gmail.com' },
        influencerBirthdate: { type: 'string', example: '1993-10-26' },
        influencerDocument: { type: 'string', example: '123.456.789-10' },
        pixKey: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        socialNetwork: { type: 'string', example: 'Instagram' },
        socialNetworkProfile: { type: 'string', example: '@influencerprofile' },
        minimumQuote: { type: 'number', example: 500.00 },
      },
      required: ['influencerName', 'influencerEmail', 'influencerBirthdate', 'influencerDocument', 'pixKey', 'socialNetwork', 'socialNetworkProfile', 'minimumQuote'],
    },
  })
  async createCoupon(@Body() couponData: Partial<Coupon>) { 
    /* 
        At this moment, I'll let this endpoint receive partial information for the 
        coupon info since I beliave that some rules will automatically be generated
        by the back-end itself. Examples: code, isActive, createAt, id
    */
    return this.couponService.createCoupon(couponData);
  }
}
