import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './coupon.entity';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Coupon], 'websiteConnection'),
        AuthModule],
    providers: [CouponService],
    controllers: [CouponController],
    exports: [CouponService],
})
export class CouponModule { }
