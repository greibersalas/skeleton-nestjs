import { Test, TestingModule } from '@nestjs/testing';
import { SubModuleService } from './sub-module.service';

describe('SubModuleService', () => {
  let service: SubModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubModuleService],
    }).compile();

    service = module.get<SubModuleService>(SubModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
