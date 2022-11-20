import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

// Entity
import { Contract } from './entity/contract.entity';
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';
import { ContractQuotaPaymentDetail } from './entity/contract_quota_payment_detail.entity';
import { ClinicHistory } from 'src/modules/clinic-history/clinic-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Contract,
    ContractDetail,
    ContractQuotaPayment,
    ContractQuotaPaymentDetail,
    ClinicHistory
  ])],
  controllers: [ContractController],
  providers: [ContractService]
})
export class ContractModule { }
