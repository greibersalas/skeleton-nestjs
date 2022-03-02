import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabOrderController } from './lab-order.controller';
import { LabOrderRepository } from './lab-order.repository';
import { LabOrderService } from './lab-order.service';
import { QuotationDetailRepository } from '../quotation/quotation-detail.repository';
import { LabOrderLabeledRepository } from '../lab-order-labeled/lab-order-labeled.repository';
import { LabOrderLabeledService } from '../lab-order-labeled/lab-order-labeled.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabOrderRepository,QuotationDetailRepository,LabOrderLabeledRepository])],
  controllers: [LabOrderController],
  providers: [LabOrderService,LabOrderLabeledService]
})
export class LabOrderModule {}
