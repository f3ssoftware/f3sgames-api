import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './order/order.module'; // Certifique-se de que está importando o PaymentModule
import { PlayerModule } from './players/player.module';
import { PagseguroIntegrationModule } from './pagseguro-integration/pagseguro-integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'paymentConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'gameConnection',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('GAME_DATABASE_HOST'),
        port: configService.get<number>('GAME_DATABASE_PORT'),
        username: configService.get<string>('GAME_DATABASE_USERNAME'),
        password: configService.get<string>('GAME_DATABASE_PASSWORD'),
        database: configService.get<string>('GAME_DATABASE_NAME'),
        autoLoadEntities: false,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    PaymentModule,
    PlayerModule,
    PagseguroIntegrationModule,
  ],
})
export class AppModule {}
