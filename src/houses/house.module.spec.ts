import { Test, TestingModule } from '@nestjs/testing';
import { HousesModule } from './house.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './house.entity';
import { HousesService } from './house.service';
import { HousesController } from './house.controller';

describe('HousesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [House],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([House], 'gameConnection'),
        HousesModule,
      ],
      providers: [HousesService],
      controllers: [HousesController],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });
});
