import { Test, TestingModule } from '@nestjs/testing';
import { ErpService } from './erp.service';

describe('ErpService', () => {
  let service: ErpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErpService],
    }).compile();

    service = module.get<ErpService>(ErpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
