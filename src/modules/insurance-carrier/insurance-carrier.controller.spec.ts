import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceCarrierController } from './insurance-carrier.controller';

describe('InsuranceCarrierController', () => {
  let controller: InsuranceCarrierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceCarrierController],
    }).compile();

    controller = module.get<InsuranceCarrierController>(InsuranceCarrierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
