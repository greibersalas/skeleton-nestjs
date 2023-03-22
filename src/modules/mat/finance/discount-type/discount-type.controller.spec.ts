import { Test, TestingModule } from '@nestjs/testing';
import { DiscountTypeController } from './discount-type.controller';

describe('DiscountTypeController', () => {
  let controller: DiscountTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountTypeController],
    }).compile();

    controller = module.get<DiscountTypeController>(DiscountTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
