import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvironmentDoctorController } from './environment-doctor.controller';
import { EnvironmentDoctorRepository } from './environment-doctor.repository';
import { EnvironmentDoctorService } from './environment-doctor.service';
import { ReservationRepository } from '../reservation/reservation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentDoctorRepository,ReservationRepository])],
  controllers: [EnvironmentDoctorController],
  providers: [EnvironmentDoctorService]
})
export class EnvironmentDoctorModule {}
