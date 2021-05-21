import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistoryModule } from '../clinic-history/clinic-history.module';
import { ClinicHistoryRepository } from '../clinic-history/clinic-history.repository';
import { ClinicHistoryService } from '../clinic-history/clinic-history.service';
import { DoctorRepository } from '../doctor/doctor.repository';
import { DoctorService } from '../doctor/doctor.service';
import { EnvironmentDoctorRepository } from '../environment-doctor/environment-doctor.repository';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ReservationRepository,EnvironmentDoctorRepository,DoctorRepository,ClinicHistoryRepository,DiaryLockRepository])],
  controllers: [ReservationController],
  providers: [ReservationService, EnvironmentDoctorService, DoctorService, ClinicHistoryService]
})
export class ReservationModule {}
