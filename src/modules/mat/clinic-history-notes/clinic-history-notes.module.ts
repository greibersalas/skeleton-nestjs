import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClinicHistoryNotesController } from './clinic-history-notes.controller';
import { ClinicHistoryNotesRepository } from './clinic-history-notes.repository';
import { ClinicHistoryNotesService } from './clinic-history-notes.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ClinicHistoryNotesRepository])],
  controllers: [ClinicHistoryNotesController],
  providers: [ClinicHistoryNotesService]
})
export class ClinicHistoryNotesModule {}
