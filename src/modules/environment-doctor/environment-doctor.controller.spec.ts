import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentDoctorController } from './environment-doctor.controller';

describe('EnvironmentDoctorController', () => {
  let controller: EnvironmentDoctorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentDoctorController],
    }).compile();

    controller = module.get<EnvironmentDoctorController>(EnvironmentDoctorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
