import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabProgrammingController } from './lab-programming.controller';
import { LabProgrammingRepository } from './lab-programming.repository';
import { LabProgrammingService } from './lab-programming.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabProgrammingRepository])],
  controllers: [LabProgrammingController],
  providers: [LabProgrammingService]
})
export class LabProgrammingModule {}
