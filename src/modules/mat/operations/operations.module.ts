import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreatmentStagesController } from './treatment-stages/treatment-stages.controller';
import { TreatmentStagesService } from './treatment-stages/treatment-stages.service';
import { TreatmentStages } from './treatment-stages/entity/treatment-stages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TreatmentStages])
  ],
  controllers: [TreatmentStagesController],
  providers: [TreatmentStagesService]
})
export class OperationsModule { }
