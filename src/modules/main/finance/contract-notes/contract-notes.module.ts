import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractNotesController } from './contract-notes.controller';
import { ContractNotesService } from './contract-notes.service';
import { ContractNotes } from './entity/contract-notes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractNotes])],
  controllers: [ContractNotesController],
  providers: [ContractNotesService]
})
export class ContractNotesModule { }
