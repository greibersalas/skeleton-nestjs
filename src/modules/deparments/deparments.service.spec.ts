import { Test, TestingModule } from '@nestjs/testing';
import { DeparmentsService } from './deparments.service';

describe('DeparmentsService', () => {
  let service: DeparmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeparmentsService],
    }).compile();

    service = module.get<DeparmentsService>(DeparmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
