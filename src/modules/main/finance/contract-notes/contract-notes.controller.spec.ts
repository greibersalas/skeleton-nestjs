import { Test, TestingModule } from '@nestjs/testing';
import { ContractNotesController } from './contract-notes.controller';

describe('ContractNotesController', () => {
  let controller: ContractNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractNotesController],
    }).compile();

    controller = module.get<ContractNotesController>(ContractNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
