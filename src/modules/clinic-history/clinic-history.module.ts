import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from '../main/finance/contract/contract.service';
import { ContractDetail } from '../main/finance/contract/entity/contract-detail.entity';
import { ContractQuotaPayment } from '../main/finance/contract/entity/contract-quota-payment.entity';
import { Contract } from '../main/finance/contract/entity/contract.entity';
import { ContractQuotaPaymentDetail } from '../main/finance/contract/entity/contract_quota_payment_detail.entity';

import { ClinicHistoryController } from './clinic-history.controller';
import { ClinicHistoryRepository } from './clinic-history.repository';
import { ClinicHistoryService } from './clinic-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicHistoryRepository,
      Contract,
      ContractDetail,
      ContractQuotaPayment,
      ContractQuotaPaymentDetail
    ])
  ],
  controllers: [ClinicHistoryController],
  providers: [
    ClinicHistoryService,
    ContractService
  ]
})
export class ClinicHistoryModule { }
