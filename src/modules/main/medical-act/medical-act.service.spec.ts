import { Test, TestingModule } from '@nestjs/testing';
import { MedicalActService } from './medical-act.service';

describe('MedicalActService', () => {
  let service: MedicalActService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalActService],
    }).compile();

    service = module.get<MedicalActService>(MedicalActService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
