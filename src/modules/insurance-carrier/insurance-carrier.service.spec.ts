import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceCarrierService } from './insurance-carrier.service';

describe('InsuranceCarrierService', () => {
  let service: InsuranceCarrierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsuranceCarrierService],
    }).compile();

    service = module.get<InsuranceCarrierService>(InsuranceCarrierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
