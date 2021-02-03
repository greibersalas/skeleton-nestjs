import { Test, TestingModule } from '@nestjs/testing';
import { DentalStatusController } from './dental-status.controller';

describe('DentalStatusController', () => {
  let controller: DentalStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DentalStatusController],
    }).compile();

    controller = module.get<DentalStatusController>(DentalStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
