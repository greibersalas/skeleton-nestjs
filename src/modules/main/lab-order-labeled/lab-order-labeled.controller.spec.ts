import { Test, TestingModule } from '@nestjs/testing';
import { LabOrderLabeledController } from './lab-order-labeled.controller';

describe('LabOrderLabeledController', () => {
  let controller: LabOrderLabeledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabOrderLabeledController],
    }).compile();

    controller = module.get<LabOrderLabeledController>(LabOrderLabeledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
