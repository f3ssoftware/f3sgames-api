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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'paymentConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
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
          entities: [Player, Account, PlayersOnline, House, BoostedBoss, BoostedCreature],
          synchronize: false,
        };
      },
      inject: [ConfigService],
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
    RashidModule
  ],
})
export class AppModule {}
