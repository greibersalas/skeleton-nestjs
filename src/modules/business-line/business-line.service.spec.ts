import { Test, TestingModule } from '@nestjs/testing';
import { BusinessLineService } from './business-line.service';

describe('BusinessLineService', () => {
  let service: BusinessLineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessLineService],
    }).compile();

    service = module.get<BusinessLineService>(BusinessLineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
