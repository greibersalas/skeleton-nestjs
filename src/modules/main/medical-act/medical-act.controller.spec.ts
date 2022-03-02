import { Test, TestingModule } from '@nestjs/testing';
import { MedicalActController } from './medical-act.controller';

describe('MedicalActController', () => {
  let controller: MedicalActController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalActController],
    }).compile();

    controller = module.get<MedicalActController>(MedicalActController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
