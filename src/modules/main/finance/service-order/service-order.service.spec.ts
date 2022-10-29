import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOrderService } from './service-order.service';

describe('SerciceOrderService', () => {
  let service: ServiceOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceOrderService],
    }).compile();

    service = module.get<ServiceOrderService>(ServiceOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
