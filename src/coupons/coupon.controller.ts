import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { GodAccountGuard } from '../auth/guards/god-account-guard';
import { Coupon } from './coupon.entity';

@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @UseGuards(GodAccountGuard) /* By using this I guarantee that only admin accounts are allowed to use this endpoint */
  @Post('create')
  async createCoupon(@Body() couponData: Partial<Coupon>) {
    return this.couponService.createCoupon(couponData);
  }
}
