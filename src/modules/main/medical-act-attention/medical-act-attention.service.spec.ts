import { Test, TestingModule } from '@nestjs/testing';
import { MedicalActAttentionService } from './medical-act-attention.service';

describe('MedicalActAttentionService', () => {
  let service: MedicalActAttentionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalActAttentionService],
    }).compile();

    service = module.get<MedicalActAttentionService>(MedicalActAttentionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
