import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorRepository } from '../doctor/doctor.repository';
import { DoctorService } from '../doctor/doctor.service';
import { EnvironmentDoctorRepository } from '../environment-doctor/environment-doctor.repository';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ReservationRepository,EnvironmentDoctorRepository,DoctorRepository])],
  controllers: [ReservationController],
  providers: [ReservationService, EnvironmentDoctorService, DoctorService]
})
export class ReservationModule {}
