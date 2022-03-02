import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryController } from './clinic-history.controller';

describe('ClinicHistoryController', () => {
  let controller: ClinicHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicHistoryController],
    }).compile();

    controller = module.get<ClinicHistoryController>(ClinicHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
