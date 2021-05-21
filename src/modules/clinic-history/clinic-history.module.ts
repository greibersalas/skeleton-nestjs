import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClinicHistoryController } from './clinic-history.controller';
import { ClinicHistoryRepository } from './clinic-history.repository';
import { ClinicHistoryService } from './clinic-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicHistoryRepository])
  ],
  controllers: [ClinicHistoryController],
  providers: [ClinicHistoryService]
})
export class ClinicHistoryModule {}
