import { Test, TestingModule } from '@nestjs/testing';
import { BoostedBossService } from './boosted-boss.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoostedBoss } from './boosted-boss.entity';

describe('BoostedBossService', () => {
  let service: BoostedBossService;
  let repository: Repository<BoostedBoss>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoostedBossService,
        {
          provide: getRepositoryToken(BoostedBoss, 'gameConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BoostedBossService>(BoostedBossService);
    repository = module.get<Repository<BoostedBoss>>(getRepositoryToken(BoostedBoss, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of boosted bosses', async () => {
    const boostedBosses = [new BoostedBoss(), new BoostedBoss()];
    jest.spyOn(repository, 'find').mockResolvedValueOnce(boostedBosses);

    const result = await service.findAll();
    expect(result).toEqual(boostedBosses);
    expect(repository.find).toHaveBeenCalled();
  });
});
