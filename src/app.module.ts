/* istanbul ignore file */
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './order/order.module';
import { PlayerModule } from './players/player.module';
import { PagseguroIntegrationModule } from './pagseguro-integration/pagseguro-integration.module';
import { Account } from './account/account.entity';
import { Player } from './players/player.entity';
import { HighscoresModule } from './highscores/highscores.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { PlayersOnlineModule } from './players-online/players-online.module';
import { PlayersOnline } from './players-online/entities/players-online.entity';
import { NewsTickerModule } from './news-ticker/news-ticker.module';
import { BoostedBoss } from './bosses/boosted-boss.entity';
import { BoostedBossModule } from './bosses/boosted-boss.module';
import { BoostedCreature } from './creatures/boosted-creature.entity';
import { BoostedCreatureModule } from './creatures/boosted-creature.module';
import { HousesModule } from './houses/house.module';
import { House } from './houses/house.entity';
import { RashidModule } from './world-changes/rashid/rashid.module';
import { NewsPost } from './news-post/news-post.entity';
import { NewsPostModule } from './news-post/news-post.module';
import { AuctionModule } from './players/auctions/auction.module';
import { Auction } from './players/auctions/auction.entity';
import { GuildModule } from './guilds/guild.module';
import { MarketOffer } from './game-market/market-offer.entity';
import { MarketOfferModule } from './game-market/market-offer.module';
import { GuildMembership } from './guilds/guild-membership/guild-membership.entity';
import { GuildInvite } from './guilds/guild-invite/guild-invite.entity';
import { Guild } from './guilds/guild.entity';
import { PlayerNamelockModule } from './players/namelocks/player-namelock.module';
import { PlayerNamelock } from './players/namelocks/player-namelock.entity';
import { Bid } from './players/auctions/bids/bid.entity';
import { BidModule } from './players/auctions/bids/bid.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsTicker } from './news-ticker/entities/news-ticker.entity';
import { AdminAccountModule } from './Admin Account/admin-account.module';
import { AdminAccount } from './Admin Account/admin-account.entity';
import { Coupon } from './coupons/coupon.entity';
import { CouponModule } from './coupons/coupon.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      name: 'websiteConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [NewsPost, Auction, Bid, NewsTicker, AdminAccount, Coupon],
          autoLoadEntities: false,
          synchronize: true,
          logging: true
        };
      },
      inject: [ConfigService],

    }),

    TypeOrmModule.forRootAsync({
      name: 'gameConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const logger = new Logger('TypeORM');
        logger.log('Connecting to game database');
        return {
          type: 'mariadb',
          host: configService.get<string>('GAME_DATABASE_HOST'),
          port: configService.get<number>('GAME_DATABASE_PORT'),
          username: configService.get<string>('GAME_DATABASE_USERNAME'),
          password: configService.get<string>('GAME_DATABASE_PASSWORD'),
          database: configService.get<string>('GAME_DATABASE_NAME'),
          entities: [Player, Account, PlayersOnline, House, BoostedBoss, BoostedCreature, MarketOffer, GuildMembership, GuildInvite, Guild, PlayerNamelock],
          synchronize: false,
        };
      },
      inject: [ConfigService],

    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com', // Hotmail/Outlook Host SMTP - Just an example
        port: 587, // Port 587 for TLS
        secure: false, // Use false for TLS
        auth: {
          user: 'nando_carvalhoo@hotmail.com', // This is the origin e-mail. In the future will be the one from F3S Games
          pass: '428181Abc#',
        },
      },
      defaults: {
        from: '"No Reply" <nando_carvalhoo@hotmail.com>', // De onde os e-mails serão enviados
      },
      template: {
        dir: __dirname + '/templates', 
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    
    PaymentModule,
    PlayerModule,
    PagseguroIntegrationModule,
    HighscoresModule,
    AccountModule,
    AuthModule,
    PlayersOnlineModule,
    NewsTickerModule,
    BoostedBossModule,
    BoostedCreatureModule,
    HousesModule,
    RashidModule,
    NewsPostModule,
    AuctionModule,
    GuildModule,
    MarketOfferModule,
    PlayerNamelockModule,
    BidModule,
    AdminAccountModule,
    CouponModule,
  ],
})
export class AppModule { }
