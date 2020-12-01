import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentDoctorController } from './environment-doctor.controller';
import { EnvironmentDoctorRepository } from './environment-doctor.repository';
import { EnvironmentDoctorService } from './environment-doctor.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentDoctorRepository])],
  controllers: [EnvironmentDoctorController],
  providers: [EnvironmentDoctorService]
})
export class EnvironmentDoctorModule {}
