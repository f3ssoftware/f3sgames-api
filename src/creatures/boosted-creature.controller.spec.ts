import { Test, TestingModule } from '@nestjs/testing';
import { BoostedCreatureController } from './boosted-creature.controller';
import { BoostedCreatureService } from './boosted-creature.service';
import { BoostedCreature } from './boosted-creature.entity';

describe('BoostedCreatureController', () => {
  let controller: BoostedCreatureController;
  let service: BoostedCreatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoostedCreatureController],
      providers: [
        {
          provide: BoostedCreatureService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              new BoostedCreature(),
              new BoostedCreature(),
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<BoostedCreatureController>(BoostedCreatureController);
    service = module.get<BoostedCreatureService>(BoostedCreatureService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of boosted creatures', async () => {
    const result = await controller.index();
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });
});
