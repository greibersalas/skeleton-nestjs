import { Test, TestingModule } from '@nestjs/testing';
import { DeparmentsController } from './deparments.controller';

describe('DeparmentsController', () => {
  let controller: DeparmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeparmentsController],
    }).compile();

    controller = module.get<DeparmentsController>(DeparmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
