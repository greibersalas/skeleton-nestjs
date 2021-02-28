import { Test, TestingModule } from '@nestjs/testing';
import { LabeledStatusService } from './labeled-status.service';

describe('LabeledStatusService', () => {
  let service: LabeledStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabeledStatusService],
    }).compile();

    service = module.get<LabeledStatusService>(LabeledStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
