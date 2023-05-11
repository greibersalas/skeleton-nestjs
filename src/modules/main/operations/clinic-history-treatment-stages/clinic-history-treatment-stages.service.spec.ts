import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryTreatmentStagesService } from './clinic-history-treatment-stages.service';

describe('ClinicHistoryTreatmentStagesService', () => {
  let service: ClinicHistoryTreatmentStagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicHistoryTreatmentStagesService],
    }).compile();

    service = module.get<ClinicHistoryTreatmentStagesService>(ClinicHistoryTreatmentStagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
