import { Test, TestingModule } from '@nestjs/testing';
import { BraketsService } from './brakets.service';

describe('BraketsService', () => {
  let service: BraketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BraketsService],
    }).compile();

    service = module.get<BraketsService>(BraketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
