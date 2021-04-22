import { Test, TestingModule } from '@nestjs/testing';
import { DiaryLockService } from './diary-lock.service';

describe('DiaryLockService', () => {
  let service: DiaryLockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryLockService],
    }).compile();

    service = module.get<DiaryLockService>(DiaryLockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
