import { Test, TestingModule } from '@nestjs/testing';
import { ErpController } from './erp.controller';

describe('ErpController', () => {
  let controller: ErpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErpController],
    }).compile();

    controller = module.get<ErpController>(ErpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
