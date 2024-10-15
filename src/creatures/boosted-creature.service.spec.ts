import { Test, TestingModule } from '@nestjs/testing';
import { BoostedCreatureService } from './boosted-creature.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoostedCreature } from './boosted-creature.entity';

describe('BoostedCreatureService', () => {
  let service: BoostedCreatureService;
  let repository: Repository<BoostedCreature>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoostedCreatureService,
        {
          provide: getRepositoryToken(BoostedCreature, 'gameConnection'),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BoostedCreatureService>(BoostedCreatureService);
    repository = module.get<Repository<BoostedCreature>>(getRepositoryToken(BoostedCreature, 'gameConnection'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of boosted creatures', async () => {
    const boostedCreatures = [new BoostedCreature(), new BoostedCreature()];
    jest.spyOn(repository, 'find').mockResolvedValueOnce(boostedCreatures);

    const result = await service.findAll();
    expect(result).toEqual(boostedCreatures);
    expect(repository.find).toHaveBeenCalled();
  });
});
