import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodCardService } from './payment-method-card.service';

describe('PaymentMethodCardService', () => {
  let service: PaymentMethodCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMethodCardService],
    }).compile();

    service = module.get<PaymentMethodCardService>(PaymentMethodCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
