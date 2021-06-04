import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicHistoryRepository } from '../clinic-history/clinic-history.repository';
import { DoctorRepository } from '../doctor/doctor.repository';
import { EnvironmentDoctorRepository } from '../environment-doctor/environment-doctor.repository';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { ReservationRepository } from '../reservation/reservation.repository';
import { ReservationService } from '../reservation/reservation.service';
import { TasksService } from './tasks.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
      TypeOrmModule.forFeature(
        [
          ReservationRepository,
          EnvironmentDoctorRepository,
          DoctorRepository,
          ClinicHistoryRepository,
          DiaryLockRepository
        ]
      ),
     MailModule,
    ],
    
  providers: [TasksService, ReservationService]
})
export class TasksModule {}
