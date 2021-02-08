import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryNotesController } from './clinic-history-notes.controller';

describe('ClinicHistoryNotesController', () => {
  let controller: ClinicHistoryNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicHistoryNotesController],
    }).compile();

    controller = module.get<ClinicHistoryNotesController>(ClinicHistoryNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
