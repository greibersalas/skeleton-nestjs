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

    async getDataPending(since: string, until: string, status: number): Promise<ServiceOrderDto[]> {
        return this.repository.createQueryBuilder('so')
            .select('*')
            .where(`so.date between '${since}' and '${until}'`)
            .andWhere(`so.status = ${status}`)
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
            attention.card = data.idpaymentmethodcard;
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
                    //state: 2
                }).where({ id })
                .execute();
            if (update) {
                return true;
            }
        }
        return false;
    }

    async setDecline(id: number, origin: string, status: number, reason: string): Promise<boolean> {
        if (origin === 'attention') {
            const attention = await this.repositoryAttention.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.state = status;

            if (reason) {
                attention.reason = reason;
            }
            if (attention.save()) {
                return true;
            }
        }
        if (origin === 'contract') {
            const attention = await this.repositoryContractPay.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.state = status;
            if (attention.save()) {
                return true;
            }
        }

        return false;
    }

    async setValidatePayment(id: number, origin: string, status: number): Promise<boolean> {
        if (origin === 'attention') {
            const attention = await this.repositoryAttention.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.status_payment = status;

            if (attention.save()) {
                return true;
            }
        }
        if (origin === 'contract') {
            const attention = await this.repositoryContractPay.findOne({ id });
            if (!attention) {
                throw new NotFoundException();
            }
            attention.status_payment = status;
            if (attention.save()) {
                return true;
            }
        }

        return false;
    }

    async getDailyIncome(since: string, until: string, status: number): Promise<DailyIncomeDto[]> {
        return this.repositoryDailyIncome.createQueryBuilder('so')
            .select('*')
            .where(`so.date between '${since}' and '${until}'`)
            .andWhere(`so.status = ${status}`)
            .orderBy('so.id', 'ASC')
            .getRawMany();
    }

    async getReportDailyPayments(since: string, until: string): Promise<ReportDailyPaymentsDto[]> {
        return this.repositoryReportDailyPay.createQueryBuilder('so')
            .select(`so.*, (
                select re.date::DATE
                   from reservation re
                   where re.date <= so.date and re.patient_id = so.idclinichistory 
                   and re.state IN (1,2,3)
                  order by re.id DESC
                limit 1
              ) as diary_date`)
            .where(`so.date between '${since}' and '${until}'`)
            .orderBy('so.patient', 'ASC')
            .getRawMany();
    }

    async getReportClinicalAssitance(since: string, until: string): Promise<ReportClinicalAssistanceDto[]> {
        return this.repositoryReportClinicalAssistance.createQueryBuilder('so')
            .select('*')
            .where(`so.date between '${since}' and '${until}'`)
            .orderBy('so.patient', 'ASC')
            .getRawMany();
    }

}
