import { Test, TestingModule } from '@nestjs/testing';
import { DiaryLockController } from './diary-lock.controller';

describe('DiaryLockController', () => {
  let controller: DiaryLockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryLockController],
    }).compile();

    controller = module.get<DiaryLockController>(DiaryLockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
