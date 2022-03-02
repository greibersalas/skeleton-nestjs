import { Test, TestingModule } from '@nestjs/testing';
import { QuotationTermsController } from './quotation-terms.controller';

describe('QuotationTermsController', () => {
  let controller: QuotationTermsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationTermsController],
    }).compile();

    controller = module.get<QuotationTermsController>(QuotationTermsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
