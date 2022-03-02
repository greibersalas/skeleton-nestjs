import { Test, TestingModule } from '@nestjs/testing';
import { MouthBreathingService } from './mouth-breathing.service';

describe('MouthBreathingService', () => {
  let service: MouthBreathingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MouthBreathingService],
    }).compile();

    service = module.get<MouthBreathingService>(MouthBreathingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
