import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabOrderLabeledController } from './lab-order-labeled.controller';
import { LabOrderLabeledRepository } from './lab-order-labeled.repository';
import { LabOrderLabeledService } from './lab-order-labeled.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabOrderLabeledRepository])],
  controllers: [LabOrderLabeledController],
  providers: [LabOrderLabeledService]
})
export class LabOrderLabeledModule {}
