import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentStagesService } from './treatment-stages.service';

describe('TreatmentStagesService', () => {
  let service: TreatmentStagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreatmentStagesService],
    }).compile();

    service = module.get<TreatmentStagesService>(TreatmentStagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
