import { Test, TestingModule } from '@nestjs/testing';
import { LabStateController } from './lab-state.controller';

describe('LabStateController', () => {
  let controller: LabStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabStateController],
    }).compile();

    controller = module.get<LabStateController>(LabStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
