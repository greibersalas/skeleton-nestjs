import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrescriptionController } from './prescription.controller';
import { PrescriptionRepository } from './prescription.repository';
import { PrescriptionService } from './prescription.service';

@Module({
  imports: [ TypeOrmModule.forFeature([PrescriptionRepository])],
  controllers: [PrescriptionController],
  providers: [PrescriptionService]
})
export class PrescriptionModule {}
