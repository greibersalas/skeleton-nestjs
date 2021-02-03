import { Test, TestingModule } from '@nestjs/testing';
import { OdontogramaService } from './odontograma.service';

describe('OdontogramaService', () => {
  let service: OdontogramaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdontogramaService],
    }).compile();

    service = module.get<OdontogramaService>(OdontogramaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
