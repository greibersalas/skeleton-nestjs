import { Test, TestingModule } from '@nestjs/testing';
import { MedicalActAttentionController } from './medical-act-attention.controller';

describe('MedicalActAttentionController', () => {
  let controller: MedicalActAttentionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalActAttentionController],
    }).compile();

    controller = module.get<MedicalActAttentionController>(MedicalActAttentionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
