import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

// Entity
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';
import { Contract } from './entity/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractDetail, ContractQuotaPayment])],
  controllers: [ContractController],
  providers: [ContractService]
})
export class ContractModule { }
