import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentDoctorService } from './environment-doctor.service';

describe('EnvironmentDoctorService', () => {
  let service: EnvironmentDoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentDoctorService],
    }).compile();

    service = module.get<EnvironmentDoctorService>(EnvironmentDoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
