import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractDetailDto } from './dto/contract-detail-dto';

// Dto
import { ContractDto } from './dto/contract-dto';
import { PaymentDto } from './dto/payment-dto';

// Entity
import { Contract } from './entity/contract.entity';
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';
import { KpiQuotaDetailDto } from './dto/kpi-quota-detail-dto';
const moment = require('moment-timezone');

@Injectable()
export class ContractService {

    constructor(
        @InjectRepository(Contract)
        private readonly repository: Repository<Contract>,
        @InjectRepository(ContractDetail)
        private readonly repositoryDetail: Repository<ContractDetail>,
        @InjectRepository(ContractQuotaPayment)
        private readonly repositoryPayment: Repository<ContractQuotaPayment>
    ) { }

    async getOne(id: number): Promise<ContractDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const data = await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.date,
            so.duration,so.amount,so.quota,so.exchange_house,so.exchange_house_url,
            so.amount_controls, so.num,ch.history, "ch"."documentNumber" AS patient_doc,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient`)
            .innerJoin('so.clinichistory', 'ch')
            .where({ id })
            .getRawOne();

        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }

    async getAll(): Promise<ContractDto[]> {
        return await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.date,
            so.duration,so.amount,so.quota,so.exchange_house,so.exchange_house_url,
            so.amount_controls, so.num,ch.history, "ch"."documentNumber" AS patient_doc,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient`)
            .innerJoin('so.clinichistory', 'ch')
            .where('so.state <> 0')
            .getRawMany();
    }

    async getDataFilters(filters: any, status = 0): Promise<ContractDto[]> {
        let where = 'so.state <> 0';
        if (status > 0) {
            where = `so.state = ${status}`;
        }
        return await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.date,
            so.duration,so.amount,so.quota,so.exchange_house,so.exchange_house_url,
            so.amount_controls, so.num,ch.history, "ch"."documentNumber" AS patient_doc,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient,
            SUM(cd.balance) AS balance`)
            .innerJoin('so.clinichistory', 'ch')
            .innerJoin('contract_detail', 'cd', 'cd.idcontract = so.id')
            .where(where)
            .andWhere(`so.created_at::DATE BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`so.id, so.type, so.idclinichistory, so.state, so.date,
            so.duration,so.amount,so.quota,so.exchange_house,so.exchange_house_url,
            so.amount_controls, so.num,ch.history, "ch"."documentNumber","ch"."lastNameFather", "ch"."lastNameMother", ch.name`)
            .getRawMany();
    }

    async getDataDetail(idcontract: number): Promise<ContractDetailDto[]> {
        return await this.repositoryDetail.createQueryBuilder('dt')
            .select(`dt.id, dt.idcontract, dt.description, dt.observation,
            dt.date::DATE, dt.amount, dt.state`)
            .where(`dt.idcontract = ${idcontract}`)
            .andWhere('dt.state <> 0')
            .orderBy('dt.id', 'ASC')
            .getRawMany();
    }

    async getDataDetailForPayment(idcontract: number): Promise<ContractDetailDto[]> {
        return await this.repositoryDetail.createQueryBuilder('dt')
            .select(`dt.id, dt.idcontract, dt.description, dt.observation,
            dt.date, dt.amount, dt.state, dt.balance`)
            .where(`dt.idcontract = ${idcontract}`)
            .andWhere('dt.state = 1')
            .orderBy('dt.date', 'ASC')
            .getRawMany();
    }

    async create(data: Contract): Promise<Contract> {
        return await this.repository.save(data);
    }

    async insertDetail(data: ContractDetail): Promise<any> {
        return this.repositoryDetail.save(data);
    }

    async update(id: number, data: Contract): Promise<Contract> {
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.repository.update(id, data);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { state: 0 });
    }

    // Payment
    async insertPayment(data: ContractQuotaPayment): Promise<any> {
        return this.repositoryPayment.save(data);
    }

    async updateDetailPayment(id: number, balance: number): Promise<ContractDetail> {
        const exists = await this.repositoryDetail.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        exists.balance = exists.balance - balance;
        if (exists.balance === 0) {
            exists.state = 2;
        }
        await exists.save();
        return await this.repositoryDetail.findOne(id);
    }

    async getPaymentList(filters: any): Promise<PaymentDto[]> {
        let where = 'qp.state <> 0';
        if (filters.state > 0) {
            where = `qp.state = ${filters.state}`;
        }
        return await this.repositoryPayment.createQueryBuilder('qp')
            .select(`qp.id, qp.payment_date AS date, qp.idcoin, qp.amount, qp.observation, qp.state, qp.file_name, qp.file_ext,
            co.code AS coin, ct.id AS idcontract, count(cd) AS cuotas, ct.idclinichistory, ct.num AS num_contract,
            concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient, ch.history`)
            .innerJoin('coin', 'co', 'co.id = qp.idcoin')
            .innerJoin('contract_quota_payment_detail', 'cd', 'cd.idcontractquotapayment = qp.id')
            .innerJoin('contract', 'ct', 'ct.id = qp.idcontract')
            .innerJoin('clinic_history', 'ch', 'ch.id = ct.idclinichistory')
            .where(`${where}`)
            .andWhere(`qp.payment_date BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`qp.id, qp.payment_date, qp.idcoin, qp.amount, qp.observation, qp.state, qp.file_name, qp.file_ext,
            co.code, ct.id, ct.idclinichistory, ct.num,"ch"."lastNameFather","ch"."lastNameMother",ch.name,ch.history`)
            .getRawMany();
    }

    async changeStatePayment(id: number, state: number, user: number): Promise<any> {
        const exists = await this.repositoryPayment.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        exists.state = state;
        exists.user = user;
        await exists.save();
        return await this.repositoryPayment.findOne(id);
    }

    async getOverdueQuota(): Promise<number> {
        const date = moment().format('YYYY-MM-DD');
        const cant = await this.repositoryDetail.createQueryBuilder('dt')
            .select('count(*) AS total')
            .where(`dt.date < '${date}'`)
            .andWhere(`dt.state = 1`)
            .getRawOne();
        return cant.total;
    }
    async getQuotaToExpiration(): Promise<number> {
        const since = moment().format('YYYY-MM-DD');
        const until = moment().add(1, 'M').format('YYYY-MM-DD');
        const cant = await this.repositoryDetail.createQueryBuilder('dt')
            .select('count(*) AS total')
            .where(`dt.date BETWEEN '${since}' AND '${until}'`)
            .andWhere(`dt.state = 1`)
            .getRawOne();
        return cant.total;
    }

    async getKpiQuotasDetail(filters: any): Promise<KpiQuotaDetailDto[]> {
        // const until = moment().add(1, 'M').format('YYYY-MM-DD');
        return await this.repositoryDetail.createQueryBuilder('det')
            .select(`ct.id AS idcontract, ct.idclinichistory, ct.num AS num_contract,
            det.description, det.date, det.amount, det.observation,
            concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient,
            ch.history, "ch"."documentNumber" AS patient_document, ch.cellphone AS patient_phone,
            ch.email AS patient_email`)
            .innerJoin('contract', 'ct', 'ct.id = det.idcontract')
            .innerJoin('clinic_history', 'ch', 'ch.id = ct.idclinichistory')
            .where(`det.date BETWEEN '${filters.since}' AND '${filters.until}'`)
            .andWhere(`det.state = 1`)
            .orderBy('det.date', 'ASC')
            .addOrderBy(`concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name)`, 'ASC')
            .getRawMany();
    }

    async getDataQuotasDetailXls(filters: any): Promise<any> {
        return await this.repositoryDetail.createQueryBuilder('det')
            .select(`ct.id AS idcontract, ct.idclinichistory, ct.num AS num_contract,
            det.description, det.date, det.amount, det.observation,
            concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient,
            ch.history, "ch"."documentNumber" AS patient_document, ch.cellphone AS patient_phone,
            ch.email AS patient_email, ch.attorney, ct.date AS contract_date,
            ct.amount AS contract_amount, ct.quota AS contract_quota,
            ctd.amount AS initial_amount, SUM(cqpd.amount) AS payment`)
            .innerJoin('contract', 'ct', 'ct.id = det.idcontract')
            .innerJoin('clinic_history', 'ch', 'ch.id = ct.idclinichistory')
            .innerJoin('contract_detail', 'ctd', `ctd.idcontract = det.idcontract AND ctd.description like '%nicial%'`)
            .innerJoin(`contract_quota_payment`, `cqp`, `cqp.idcontract = ct.id`)
            .innerJoin(`contract_quota_payment_detail`, `cqpd`, `cqpd.idcontractquotapayment = cqp.id`)
            .where(`det.date BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`ct.id, ct.idclinichistory, ct.num, det.description, det.date, det.amount, det.observation,
            "ch"."lastNameFather","ch"."lastNameMother",ch.name, ch.history, "ch"."documentNumber", ch.cellphone,
            ch.email, ch.attorney, ct.date, ct.amount, ct.quota, ctd.amount`)
            .andWhere(`det.state = 1`)
            .orderBy('det.date', 'ASC')
            .addOrderBy(`concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name)`, 'ASC')
            // .getQuery();
            .getRawMany();
    }

}
