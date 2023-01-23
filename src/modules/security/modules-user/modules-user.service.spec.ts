import { Test, TestingModule } from '@nestjs/testing';
import { ModulesUserService } from './modules-user.service';

describe('ModulesUserService', () => {
  let service: ModulesUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulesUserService],
    }).compile();

    service = module.get<ModulesUserService>(ModulesUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
