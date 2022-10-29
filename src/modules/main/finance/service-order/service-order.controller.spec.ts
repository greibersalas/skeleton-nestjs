import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOrderController } from './service-order.controller';

describe('ServiceOrderController', () => {
  let controller: ServiceOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceOrderController],
    }).compile();

    controller = module.get<ServiceOrderController>(ServiceOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
