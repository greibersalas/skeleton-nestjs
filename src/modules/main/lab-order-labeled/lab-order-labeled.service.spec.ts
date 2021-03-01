import { Test, TestingModule } from '@nestjs/testing';
import { LabOrderLabeledService } from './lab-order-labeled.service';

describe('LabOrderLabeledService', () => {
  let service: LabOrderLabeledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabOrderLabeledService],
    }).compile();

    service = module.get<LabOrderLabeledService>(LabOrderLabeledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
