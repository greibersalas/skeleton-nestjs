import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentStagesController } from './treatment-stages.controller';

describe('TreatmentStagesController', () => {
  let controller: TreatmentStagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentStagesController],
    }).compile();

    controller = module.get<TreatmentStagesController>(TreatmentStagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
