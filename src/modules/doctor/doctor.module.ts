import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorRepository } from './doctor.repository';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorRepository])
  ],
  controllers: [DoctorController],
  providers: [DoctorService]
})
export class DoctorModule {}
