import { Test, TestingModule } from '@nestjs/testing';
import { ModulesUserController } from './modules-user.controller';

describe('ModulesUserController', () => {
  let controller: ModulesUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesUserController],
    }).compile();

    controller = module.get<ModulesUserController>(ModulesUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
