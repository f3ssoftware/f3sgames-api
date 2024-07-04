import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './order/order.module';
import { PlayerModule } from './players/player.module';
import { PagseguroIntegrationModule } from './pagseguro-integration/pagseguro-integration.module';
import { Account } from './account/account.entity';
import { Player } from './players/player.entity';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'paymentConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const paymentConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
        console.log('Payment Database Config:', paymentConfig);
        return paymentConfig;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'gameConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const gameConfig: TypeOrmModuleOptions = {
          type: 'mariadb',
          host: configService.get<string>('GAME_DATABASE_HOST'),
          port: configService.get<number>('GAME_DATABASE_PORT'),
          username: configService.get<string>('GAME_DATABASE_USERNAME'),
          password: configService.get<string>('GAME_DATABASE_PASSWORD'),
          database: configService.get<string>('GAME_DATABASE_NAME'),
          entities: [Player, Account],
          synchronize: false,
        };
        console.log('Game Database Config:', gameConfig);
        return gameConfig;
      },
      inject: [ConfigService],
    }),
    PaymentModule,
    PlayerModule,
    PagseguroIntegrationModule,
    AccountModule,
    AuthModule,
  ],
})
export class AppModule {}
