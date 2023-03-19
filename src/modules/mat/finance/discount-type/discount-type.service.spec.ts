import { Test, TestingModule } from '@nestjs/testing';
import { DiscountTypeService } from './discount-type.service';

describe('DiscountTypeService', () => {
  let service: DiscountTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountTypeService],
    }).compile();

    service = module.get<DiscountTypeService>(DiscountTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
