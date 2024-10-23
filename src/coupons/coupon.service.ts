import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon, 'websiteConnection')
    private couponRepository: Repository<Coupon>,
  ) {}

  async createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.couponRepository.create(couponData);
    return this.couponRepository.save(coupon);
  }

}
