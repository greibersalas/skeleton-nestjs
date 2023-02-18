import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodCardController } from './payment-method-card.controller';

describe('PaymentMethodCardController', () => {
  let controller: PaymentMethodCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMethodCardController],
    }).compile();

    controller = module.get<PaymentMethodCardController>(PaymentMethodCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
