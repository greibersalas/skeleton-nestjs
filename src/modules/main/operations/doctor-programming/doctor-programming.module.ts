import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProgrammingController } from './doctor-programming.controller';
import { DoctorProgrammingService } from './doctor-programming.service';
import { DoctorProgramming } from './entity/doctor-programming.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorProgramming])],
  controllers: [DoctorProgrammingController],
  providers: [DoctorProgrammingService]
})
export class DoctorProgrammingModule { }
