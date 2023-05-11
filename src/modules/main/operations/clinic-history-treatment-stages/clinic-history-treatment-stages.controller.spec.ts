import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryTreatmentStagesController } from './clinic-history-treatment-stages.controller';

describe('ClinicHistoryTreatmentStagesController', () => {
  let controller: ClinicHistoryTreatmentStagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicHistoryTreatmentStagesController],
    }).compile();

    controller = module.get<ClinicHistoryTreatmentStagesController>(ClinicHistoryTreatmentStagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
