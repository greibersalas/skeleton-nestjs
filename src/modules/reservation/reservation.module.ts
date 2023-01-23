import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { ClinicHistoryRepository } from '../clinic-history/clinic-history.repository';
import { ClinicHistoryService } from '../clinic-history/clinic-history.service';
import { DoctorRepository } from '../doctor/doctor.repository';
import { DoctorService } from '../doctor/doctor.service';
import { EnvironmentDoctorRepository } from '../environment-doctor/environment-doctor.repository';
import { EnvironmentDoctorService } from '../environment-doctor/environment-doctor.service';
import { DiaryLockRepository } from '../main/diary-lock/diary-lock.repository';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';
import { ContractService } from '../main/finance/contract/contract.service';
import { Contract } from '../main/finance/contract/entity/contract.entity';
import { ContractDetail } from '../main/finance/contract/entity/contract-detail.entity';
import { ContractQuotaPayment } from '../main/finance/contract/entity/contract-quota-payment.entity';
import { ContractQuotaPaymentDetail } from '../main/finance/contract/entity/contract_quota_payment_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ReservationRepository,
        EnvironmentDoctorRepository,
        DoctorRepository,
        ClinicHistoryRepository,
        DiaryLockRepository,
        Contract,
        ContractDetail,
        ContractQuotaPayment,
        ContractQuotaPaymentDetail
      ]
    ),
    MailModule
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    EnvironmentDoctorService,
    DoctorService,
    ClinicHistoryService,
    ContractService
  ]
})
export class ReservationModule { }
