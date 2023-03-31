import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeHouseService } from './exchange-house.service';

describe('ExchangeHouseService', () => {
  let service: ExchangeHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeHouseService],
    }).compile();

    service = module.get<ExchangeHouseService>(ExchangeHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
