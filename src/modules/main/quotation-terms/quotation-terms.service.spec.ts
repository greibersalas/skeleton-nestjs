import { Test, TestingModule } from '@nestjs/testing';
import { QuotationTermsService } from './quotation-terms.service';

describe('QuotationTermsService', () => {
  let service: QuotationTermsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationTermsService],
    }).compile();

    service = module.get<QuotationTermsService>(QuotationTermsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
