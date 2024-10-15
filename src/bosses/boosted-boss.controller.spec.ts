import { Test, TestingModule } from '@nestjs/testing';
import { BoostedBossController } from './boosted-boss.controller';
import { BoostedBossService } from './boosted-boss.service';
import { BoostedBoss } from './boosted-boss.entity';

describe('BoostedBossController', () => {
  let controller: BoostedBossController;
  let service: BoostedBossService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoostedBossController],
      providers: [
        {
          provide: BoostedBossService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              new BoostedBoss(),
              new BoostedBoss(),
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<BoostedBossController>(BoostedBossController);
    service = module.get<BoostedBossService>(BoostedBossService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of boosted bosses', async () => {
    const result = await controller.findAll();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });
});
