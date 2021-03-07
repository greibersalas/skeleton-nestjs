import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabOrderController } from './lab-order.controller';
import { LabOrderRepository } from './lab-order.repository';
import { LabOrderService } from './lab-order.service';
import { QuotationDetailRepository } from '../quotation/quotation-detail.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LabOrderRepository,QuotationDetailRepository])],
  controllers: [LabOrderController],
  providers: [LabOrderService]
})
export class LabOrderModule {}
