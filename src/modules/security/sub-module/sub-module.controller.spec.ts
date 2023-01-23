import { Test, TestingModule } from '@nestjs/testing';
import { SubModuleController } from './sub-module.controller';

describe('SubModuleController', () => {
  let controller: SubModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubModuleController],
    }).compile();

    controller = module.get<SubModuleController>(SubModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
