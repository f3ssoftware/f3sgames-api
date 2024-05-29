import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './order/order.module';
import { PlayerModule } from './players/player.module';
import { PagseguroIntegrationModule } from './pagseguro-integration/pagseguro-integration.module';
import { Order } from './order/order.entity';
import { Player } from './players/player.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Order, Player],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PaymentModule,
    PlayerModule,
    PagseguroIntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
