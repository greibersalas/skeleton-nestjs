import { Test, TestingModule } from '@nestjs/testing';
import { ContractNotesService } from './contract-notes.service';

describe('ContractNotesService', () => {
  let service: ContractNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractNotesService],
    }).compile();

    service = module.get<ContractNotesService>(ContractNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
