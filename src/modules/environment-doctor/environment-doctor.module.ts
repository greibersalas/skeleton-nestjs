import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvironmentDoctorController } from './environment-doctor.controller';
import { EnvironmentDoctorRepository } from './environment-doctor.repository';
import { EnvironmentDoctorService } from './environment-doctor.service';
import { ReservationRepository } from '../reservation/reservation.repository';
import { ReservationService } from '../reservation/reservation.service';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentDoctorRepository,ReservationRepository,DiaryLockRepository]),MailModule],
  controllers: [EnvironmentDoctorController],
  providers: [EnvironmentDoctorService, ReservationService]
})
export class EnvironmentDoctorModule {}
