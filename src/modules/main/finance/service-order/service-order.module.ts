import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';

// Entity
import { ViewServiceOrder } from './entity/service-order-view.entity';
import { MedicalActAttention } from '../../medical-act-attention/medical-act-attention.entity';
import { ContractQuotaPayment } from '../contract/entity/contract-quota-payment.entity';
import { ViewDailyIncome } from './entity/daily-income-view.entity';
import { ViewReportDailyPayments } from './entity/report-daily-payments.entity';
import { ViewReportClinicalAssistance } from './entity/report-clinical-Assitance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ViewServiceOrder,
    MedicalActAttention,
    ContractQuotaPayment,
    ViewDailyIncome,
    ViewReportDailyPayments,
    ViewReportClinicalAssistance
  ])],
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService]
})
export class ServiceOrderModule { }
