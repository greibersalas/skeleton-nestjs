import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MedicalActController } from './medical-act.controller';
import { MedicalActService } from './medical-act.service';
import { MedicalActRepository } from './medical-act.repository';
import { MedicalActFileGroupRepository } from './medical-act-file-group.repository';
import { MedicalActFilesRepository } from './medical-act-files.repository';
import { ReservationRepository } from '../../reservation/reservation.repository';
import { MedicalActAttention } from '../medical-act-attention/medical-act-attention.entity';
import { MedicalActAttentionService } from '../medical-act-attention/medical-act-attention.service';
import { ContractQuotaPayment } from '../finance/contract/entity/contract-quota-payment.entity';
import { ContractService } from '../finance/contract/contract.service';
import { ContractDetail } from '../finance/contract/entity/contract-detail.entity';
import { ContractQuotaPaymentDetail } from '../finance/contract/entity/contract_quota_payment_detail.entity';
import { Contract } from '../finance/contract/entity/contract.entity';
import { ClinicHistory } from 'src/modules/clinic-history/clinic-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    MedicalActRepository,
    MedicalActFilesRepository,
    MedicalActFileGroupRepository,
    ReservationRepository,
    MedicalActAttention,
    ContractQuotaPayment,
    ContractDetail,
    ContractQuotaPaymentDetail,
    Contract,
    ClinicHistory
  ])],
  controllers: [MedicalActController],
  providers: [
    MedicalActService,
    MedicalActAttentionService,
    ContractService
  ]
})
export class MedicalActModule { }
