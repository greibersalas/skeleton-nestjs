import { Test, TestingModule } from '@nestjs/testing';
import { LabStateService } from './lab-state.service';

describe('LabStateService', () => {
  let service: LabStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabStateService],
    }).compile();

    service = module.get<LabStateService>(LabStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
