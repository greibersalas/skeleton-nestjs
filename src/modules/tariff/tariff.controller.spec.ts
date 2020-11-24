import { Test, TestingModule } from '@nestjs/testing';
import { TariffController } from './tariff.controller';

describe('TariffController', () => {
  let controller: TariffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffController],
    }).compile();

    controller = module.get<TariffController>(TariffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
