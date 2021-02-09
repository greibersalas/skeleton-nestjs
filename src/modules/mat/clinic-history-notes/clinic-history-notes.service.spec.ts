import { Test, TestingModule } from '@nestjs/testing';
import { ClinicHistoryNotesService } from './clinic-history-notes.service';

describe('ClinicHistoryNotesService', () => {
  let service: ClinicHistoryNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicHistoryNotesService],
    }).compile();

    service = module.get<ClinicHistoryNotesService>(ClinicHistoryNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
