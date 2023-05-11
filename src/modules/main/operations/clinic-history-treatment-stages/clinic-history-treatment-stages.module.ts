import { Module } from '@nestjs/common';
import { ClinicHistoryTreatmentStagesController } from './clinic-history-treatment-stages.controller';
import { ClinicHistoryTreatmentStagesService } from './clinic-history-treatment-stages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistoryTreatmentStages } from './entity/clinic-history-treatment-stages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicHistoryTreatmentStages])
  ],
  controllers: [ClinicHistoryTreatmentStagesController],
  providers: [ClinicHistoryTreatmentStagesService]
})
export class ClinicHistoryTreatmentStagesModule { }
