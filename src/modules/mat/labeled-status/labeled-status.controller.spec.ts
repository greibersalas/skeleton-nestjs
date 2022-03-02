import { Test, TestingModule } from '@nestjs/testing';
import { LabeledStatusController } from './labeled-status.controller';

describe('LabeledStatusController', () => {
  let controller: LabeledStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabeledStatusController],
    }).compile();

    controller = module.get<LabeledStatusController>(LabeledStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
