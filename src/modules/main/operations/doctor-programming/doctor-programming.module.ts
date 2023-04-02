import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/modules/mail/mail.module';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';
import { ReservationService } from 'src/modules/reservation/reservation.service';
import { DiaryLockRepository } from '../../diary-lock/diary-lock.repository';

import { DoctorProgrammingController } from './doctor-programming.controller';
import { DoctorProgrammingService } from './doctor-programming.service';

import { ViewDoctorProgramming } from './entity/doctor-programming-view.entity';
import { DoctorProgramming } from './entity/doctor-programming.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorProgramming,
      ViewDoctorProgramming,
      DiaryLockRepository,
      ReservationRepository,
    ]),
    MailModule
  ],
  controllers: [DoctorProgrammingController],
  providers: [
    DoctorProgrammingService,
    ReservationService
  ]
})
export class DoctorProgrammingModule { }
