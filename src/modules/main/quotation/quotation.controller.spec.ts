import { Test, TestingModule } from '@nestjs/testing';
import { QuotationController } from './quotation.controller';

describe('QuotationController', () => {
  let controller: QuotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotationController],
    }).compile();

    controller = module.get<QuotationController>(QuotationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
