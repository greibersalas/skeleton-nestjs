import { Test, TestingModule } from '@nestjs/testing';
import { MouthBreathingController } from './mouth-breathing.controller';

describe('MouthBreathingController', () => {
  let controller: MouthBreathingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MouthBreathingController],
    }).compile();

    controller = module.get<MouthBreathingController>(MouthBreathingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
