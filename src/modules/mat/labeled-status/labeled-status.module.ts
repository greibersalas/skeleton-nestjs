import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabeledStatusController } from './labeled-status.controller';
import { LabeledStatusRepository } from './labeled-status.repository';
import { LabeledStatusService } from './labeled-status.service';

@Module({
  imports: [ TypeOrmModule.forFeature([LabeledStatusRepository])],
  controllers: [LabeledStatusController],
  providers: [LabeledStatusService]
})
export class LabeledStatusModule {}
