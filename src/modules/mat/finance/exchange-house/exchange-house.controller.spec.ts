import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeHouseController } from './exchange-house.controller';

describe('ExchangeHouseController', () => {
  let controller: ExchangeHouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeHouseController],
    }).compile();

    controller = module.get<ExchangeHouseController>(ExchangeHouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
