import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProgrammingService } from './doctor-programming.service';

describe('DoctorProgrammingService', () => {
  let service: DoctorProgrammingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorProgrammingService],
    }).compile();

    service = module.get<DoctorProgrammingService>(DoctorProgrammingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
