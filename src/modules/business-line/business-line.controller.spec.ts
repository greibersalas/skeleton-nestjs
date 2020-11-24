import { Test, TestingModule } from '@nestjs/testing';
import { BusinessLineController } from './business-line.controller';

describe('BusinessLineController', () => {
  let controller: BusinessLineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessLineController],
    }).compile();

    controller = module.get<BusinessLineController>(BusinessLineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
