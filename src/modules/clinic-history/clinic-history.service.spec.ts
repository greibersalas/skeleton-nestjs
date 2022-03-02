import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryService } from './clinic-history.service';

describe('ClinicHistoryService', () => {
  let service: ClinicHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicHistoryService],
    }).compile();

    service = module.get<ClinicHistoryService>(ClinicHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
