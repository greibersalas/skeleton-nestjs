import { Test, TestingModule } from '@nestjs/testing';
import { DentalStatusService } from './dental-status.service';

describe('DentalStatusService', () => {
  let service: DentalStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DentalStatusService],
    }).compile();

    service = module.get<DentalStatusService>(DentalStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
