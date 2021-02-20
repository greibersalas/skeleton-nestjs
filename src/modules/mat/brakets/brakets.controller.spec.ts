import { Test, TestingModule } from '@nestjs/testing';
import { BraketsController } from './brakets.controller';

describe('BraketsController', () => {
  let controller: BraketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BraketsController],
    }).compile();

    controller = module.get<BraketsController>(BraketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
