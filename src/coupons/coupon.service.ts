import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CouponService {
    constructor(
        @InjectRepository(Coupon, 'websiteConnection')
        private couponRepository: Repository<Coupon>,
        private mailerService: MailerService, // Injetar o serviço de e-mail
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async createCoupon(couponData: Partial<Coupon>): Promise<Partial<Coupon>> {
        // For now, it's generating a fake coupon
        const couponCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const coupon = this.couponRepository.create({
            ...couponData,
            code: couponCode,
            isActive: true,
        });

        const savedCoupon = await this.couponRepository.save(coupon);

        // Checking coupons validation
        this.scheduleCouponExpiration(savedCoupon.id);

        // Email should be given by the front-end when the admin is creating the coupon
        await this.sendCouponEmail(savedCoupon.influencerEmail, savedCoupon.code);

        return { /* Don't wanna all the info being informed back from the endpoint to the front-end */
            code: savedCoupon.code,
            isActive: savedCoupon.isActive,
        };
    }

    // This method is needed only to manipulate the column isActive from the Coupon Table
    private scheduleCouponExpiration(couponId: number) {
        const expirationTime = 2 * 60 * 1000; // Remembering that 

        setTimeout(async () => {
            const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
            if (coupon && coupon.isActive) {
                coupon.isActive = false;
                await this.couponRepository.save(coupon);
                console.log(`Coupon ${couponId} has been deactivated.`);
            }
        }, expirationTime);
    }

    // This one is needed for one of the last steps that is to send the influencer an email
    private async sendCouponEmail(influencerEmail: string, couponCode: string) {
        await this.mailerService.sendMail({
            to: influencerEmail,
            subject: 'Your Coupon Code is generated',
            text: `Seu código de cupom é ${couponCode}`, // Could be translated to english in the future
        });
    }
}
