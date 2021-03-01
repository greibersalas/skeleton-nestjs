import { Test, TestingModule } from '@nestjs/testing';
import { LabProgrammingService } from './lab-programming.service';

describe('LabProgrammingService', () => {
  let service: LabProgrammingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabProgrammingService],
    }).compile();

    service = module.get<LabProgrammingService>(LabProgrammingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
