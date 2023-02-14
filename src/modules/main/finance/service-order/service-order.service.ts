import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalActAttention } from '../../medical-act-attention/medical-act-attention.entity';
import { ContractQuotaPayment } from '../contract/entity/contract-quota-payment.entity';
import { DailyIncomeDto } from './dto/daily-income-view-dto';
import { ReportClinicalAssistanceDto } from './dto/report-clinical-assistance-dto';
import { ReportDailyPaymentsDto } from './dto/report-daily-payments-dto';

import { ServiceOrderDto } from './dto/service-order-dto';
import { ViewDailyIncome } from './entity/daily-income-view.entity';
import { ViewReportClinicalAssistance } from './entity/report-clinical-Assitance.entity';
import { ViewReportDailyPayments } from './entity/report-daily-payments.entity';
import { ViewServiceOrder } from './entity/service-order-view.entity';



@Injectable()
export class ServiceOrderService {

    constructor(
        @InjectRepository(ViewServiceOrder)
        private readonly repository: Repository<ViewServiceOrder>,
        @InjectRepository(MedicalActAttention)
        private readonly repositoryAttention: Repository<MedicalActAttention>,
        @InjectRepository(ContractQuotaPayment)
        private readonly repositoryContractPay: Repository<ContractQuotaPayment>,
        @InjectRepository(ViewDailyIncome)
        private readonly repositoryDailyIncome: Repository<ViewDailyIncome>,
        @InjectRepository(ViewReportDailyPayments)
        private readonly repositoryReportDailyPay: Repository<ViewReportDailyPayments>,
        @InjectRepository(ViewReportClinicalAssistance)
        private readonly repositoryReportClinicalAssistance: Repository<ViewReportClinicalAssistance>,
    ) { }

    async getDataPending(date: string): Promise<ServiceOrderDto[]> {
        return this.repository.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .andWhere('so.status = 1')
            .orderBy('so.id', 'ASC')
            .getRawMany();
    }

    async setPaymentData(id: number, data: ServiceOrderDto, user: number): Promise<boolean> {
        if (data.origin === 'attention') {
            const attention = await this.repositoryAttention.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.idpaymentmethod = data.idpaymentmethod;
            attention.bankaccount = data.idbankaccount;
            attention.operation_number = data.operation_number;
            attention.document_type = data.document_type;
            attention.document_number = data.document_number;
            attention.document_date = data.document_date;
            attention.state = 2;
            if (attention.save()) {
                return true;
            }
        }
        if (data.origin === 'contract') {
            const attention = await this.repositoryContractPay.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            const update = await this.repositoryContractPay.createQueryBuilder('cp')
                .update(ContractQuotaPayment)
                .set({
                    bankaccount: data.idbankaccount,
                    operation_number: data.operation_number,
                    document_type: data.document_type,
                    document_number: data.document_number,
                    document_date: data.document_date,
                    idpaymentmethod: data.idpaymentmethod,
                    state: 2
                }).where({ id })
                .execute();
            /* attention.id = data.idpaymentmethod;
            attention.bankaccount = data.idbankaccount;
            attention.operation_number = data.operation_number;
            attention.document_type = data.document_type;
            attention.document_number = data.document_number;
            attention.document_date = data.document_date;
            attention.coin = data.idcoin;
            attention.user = user;
            attention.state = 2; */
            if (update) {
                return true;
            }
        }
        return false;
    }

    async setDecline(id: number, origin: string): Promise<boolean> {
        if (origin === 'attention') {
            const attention = await this.repositoryAttention.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.state = 3;
            if (attention.save()) {
                return true;
            }
        }
        if (origin === 'contract') {
            const attention = await this.repositoryContractPay.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.state = 3;
            if (attention.save()) {
                return true;
            }
        }

        return false;
    }

    async getDailyIncome(date: string): Promise<DailyIncomeDto[]> {
        return this.repositoryDailyIncome.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .andWhere('so.status in (1,2)')
            .orderBy('so.id', 'ASC')
            .getRawMany();
    }

    async getReportDailyPayments(date: string): Promise<ReportDailyPaymentsDto[]> {
        return this.repositoryReportDailyPay.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .orderBy('so.patient', 'ASC')
            .getRawMany();
    }

    async getReportClinicalAssitance(date: string): Promise<ReportClinicalAssistanceDto[]> {
        return this.repositoryReportClinicalAssistance.createQueryBuilder('so')
            .select('*')
            .where(`so.date = '${date}'`)
            .orderBy('so.patient', 'ASC')
            .getRawMany();
    }

}
