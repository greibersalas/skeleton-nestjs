import { Test, TestingModule } from '@nestjs/testing';
import { LabProgrammingController } from './lab-programming.controller';

describe('LabProgrammingController', () => {
  let controller: LabProgrammingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabProgrammingController],
    }).compile();

    controller = module.get<LabProgrammingController>(LabProgrammingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
