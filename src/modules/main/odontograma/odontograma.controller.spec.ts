import { Test, TestingModule } from '@nestjs/testing';
import { OdontogramaController } from './odontograma.controller';

describe('OdontogramaController', () => {
  let controller: OdontogramaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdontogramaController],
    }).compile();

    controller = module.get<OdontogramaController>(OdontogramaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
