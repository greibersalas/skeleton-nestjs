import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProgrammingController } from './doctor-programming.controller';

describe('DoctorProgrammingController', () => {
  let controller: DoctorProgrammingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorProgrammingController],
    }).compile();

    controller = module.get<DoctorProgrammingController>(DoctorProgrammingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
