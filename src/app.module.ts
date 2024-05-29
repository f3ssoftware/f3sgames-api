import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './order/order.module';
import { Order } from './order/order.entity';
import { Player } from './players/player.entity'
import { PlayerModule } from './players/player.module'
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o módulo de configuração disponível globalmente
      envFilePath: '.env', // Especifica o caminho do arquivo .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Order, Player],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PaymentModule,
    PlayerModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
