import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalActController } from './medical-act.controller';
import { MedicalActService } from './medical-act.service';
import { MedicalActRepository } from './medical-act.repository';
import { MedicalActFileGroupRepository } from './medical-act-file-group.repository';
import { MedicalActFilesRepository } from './medical-act-files.repository';
import { ReservationRepository } from '../../reservation/reservation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    MedicalActRepository,
    MedicalActFilesRepository,
    MedicalActFileGroupRepository,
    ReservationRepository
  ])],
  controllers: [MedicalActController],
  providers: [MedicalActService]
})
export class MedicalActModule {}
