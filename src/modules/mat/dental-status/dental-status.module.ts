import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DentalStatusController } from './dental-status.controller';
import { DentalStatusRepository } from './dental-status.repository';
import { DentalStatusService } from './dental-status.service';

@Module({
  imports: [ TypeOrmModule.forFeature([DentalStatusRepository])],
  controllers: [DentalStatusController],
  providers: [DentalStatusService]
})
export class DentalStatusModule {}
