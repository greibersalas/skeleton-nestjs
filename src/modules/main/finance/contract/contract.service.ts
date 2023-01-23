import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

// Dto
import { ContractDto } from './dto/contract-dto';
import { ContractDetailDto } from './dto/contract-detail-dto';
import { KpiQuotaDetailDto } from './dto/kpi-quota-detail-dto';
import { PaymentDto } from './dto/payment-dto';
import { PaymentDetailDto } from './dto/payment-detail-dto';

// Entity
import { Contract } from './entity/contract.entity';
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';
import { ContractQuotaPaymentDetail } from './entity/contract_quota_payment_detail.entity';
import { ClinicHistory } from 'src/modules/clinic-history/clinic-history.entity';

@Injectable()
export class ContractService {

    constructor(
        @InjectRepository(Contract)
        private readonly repository: Repository<Contract>,
        @InjectRepository(ContractDetail)
        private readonly repositoryDetail: Repository<ContractDetail>,
        @InjectRepository(ContractQuotaPayment)
        private readonly repositoryPayment: Repository<ContractQuotaPayment>,
        @InjectRepository(ContractQuotaPaymentDetail)
        private readonly repositoryPaymentDetail: Repository<ContractQuotaPaymentDetail>,
        @InjectRepository(ClinicHistory)
        private readonly repositoryClinicHistory: Repository<ClinicHistory>
    ) { }

    async getOne(id: number): Promise<ContractDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const data = await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.date,
            so.duration,so.amount,so.quota,so.exchange_house,so.exchange_house_url,
            so.amount_controls, so.num,ch.history, "ch"."documentNumber" AS patient_doc,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient,
            ch.attorney`)
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
            dt.date::DATE, dt.amount, dt.state, dt.balance`)
            .where(`dt.idcontract = ${idcontract}`)
            .andWhere('dt.state <> 0')
            .orderBy('dt.date', 'ASC')
            .getRawMany();
    }

    async getDataDetailById(idcontractdetail: number): Promise<ContractDetail> {
        return await this.repositoryDetail.findOne({ where: { id: idcontractdetail } });
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

    async signature(id: number, signature: string): Promise<Contract> {
        const exists = await this.repository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { signature });
        return await this.repository.findOne(id);
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

    async updateDetailPayment(id: number, item: ContractDetail): Promise<ContractDetail> {
        const exists = await this.repositoryDetail.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        if (item.discount > 0) {
            exists.discount = item.discount;
            const discountAmount = ((exists.balance * exists.discount) / 100);
            exists.balance = exists.balance - (item.balance + discountAmount);
            exists.observation = item.observation;
            console.log({ balance: exists.balance, discountAmount });
        }
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
            concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient, ch.history, qp.idbank, ba.name AS bank`)
            .innerJoin('coin', 'co', 'co.id = qp.idcoin')
            .innerJoin('contract_quota_payment_detail', 'cd', 'cd.idcontractquotapayment = qp.id')
            .innerJoin('contract', 'ct', 'ct.id = qp.idcontract')
            .innerJoin('clinic_history', 'ch', 'ch.id = ct.idclinichistory')
            .innerJoin('qp.bank', 'ba', 'ba.id = qp.idbank')
            .where(`${where}`)
            .andWhere(`qp.payment_date BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`qp.id, qp.payment_date, qp.idcoin, qp.amount, qp.observation, qp.state, qp.file_name, qp.file_ext,
            co.code, ct.id, ct.idclinichistory, ct.num,"ch"."lastNameFather","ch"."lastNameMother",ch.name,ch.history,ba.name, qp.idbank`)
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

    async getPaymentData(idpayment: number): Promise<PaymentDto> {
        return this.repositoryPayment.createQueryBuilder('qp')
            .select(`qp.id, qp.payment_date, qp.idcoin, qp.amount, qp.observation, qp.state,
            qp.file_name, qp.file_ext, qp.bank, qp.idcontract, co.code AS coin, ct.idclinichistory,
            ct.num AS num_contract, concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient,
            ch.history, "ch"."documentNumber" AS patient_doc`)
            .innerJoin(`coin`, `co`, `co.id = qp.idcoin`)
            .innerJoin(`contract`, `ct`, `ct.id = qp.idcontract`)
            .innerJoin(`clinic_history`, `ch`, `ch.id = ct.idclinichistory`)
            .where(`qp.id = ${idpayment}`)
            .getRawOne();
    }

    async getPaymentDetail(idpayment: number): Promise<PaymentDetailDto[]> {
        return this.repositoryPaymentDetail.createQueryBuilder('qpd')
            .select(`qpd.id, qpd.idcontractdetail, qpd.amount,
            cd.description, cd.date AS quota_date, cd.amount AS quota_amount, cd.observation`)
            .innerJoin(`contract_detail`, `cd`, `cd.id = qpd.idcontractdetail`)
            .where(`qpd.idcontractquotapayment = ${idpayment}`)
            .andWhere(`qpd.state = 1`)
            .getRawMany();
    }

    async getKpiQuotasDetail(filters: any): Promise<KpiQuotaDetailDto[]> {
        // const until = moment().add(1, 'M').format('YYYY-MM-DD');
        return await this.repositoryDetail.createQueryBuilder('det')
            .select(`ct.id AS idcontract, ct.idclinichistory, ct.num AS num_contract,
            det.description, det.date, det.amount, det.observation,
            concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name) AS patient,
            ch.history, "ch"."documentNumber" AS patient_document, ch.cellphone AS patient_phone,
            ch.email AS patient_email, (now()::DATE - det.date::DATE) as dayDelinquency`)
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
            ctd.amount AS initial_amount, SUM(cqpd.amount) AS payment,
            ctd.date AS date_quota, ct.executive, ctd.amount AS amountQuota`)
            .innerJoin('contract', 'ct', 'ct.id = det.idcontract')
            .innerJoin('clinic_history', 'ch', 'ch.id = ct.idclinichistory')
            .innerJoin('contract_detail', 'ctd', `ctd.idcontract = det.idcontract AND ctd.description like '%nicial%'`)
            .leftJoin(`contract_quota_payment`, `cqp`, `cqp.idcontract = ct.id`)
            .leftJoin(`contract_quota_payment_detail`, `cqpd`, `cqpd.idcontractquotapayment = cqp.id`)
            .where(`det.date BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`ct.id, ct.idclinichistory, ct.num, det.description, det.date, det.amount, det.observation,
            "ch"."lastNameFather","ch"."lastNameMother",ch.name, ch.history, "ch"."documentNumber", ch.cellphone,
            ch.email, ch.attorney, ct.date, ct.amount, ct.quota, ctd.amount, ctd.date`)
            .andWhere(`det.state = 1`)
            .orderBy('det.date', 'ASC')
            .addOrderBy(`concat_ws(' ',"ch"."lastNameFather","ch"."lastNameMother",ch.name)`, 'ASC')
            // .getQuery();
            .getRawMany();
    }

    async regularNumDoc(data: any[], user: number): Promise<any> {
        let count: number = 0;
        await this.repositoryDetail.delete({});
        await this.repository.delete({});
        await Promise.all(
            data.map(async (it) => {
                const exist = await this.repositoryClinicHistory.findOne({
                    where: { history: it[0] }
                });
                if (exist) {
                    try {
                        const cuotas = it[10];
                        const cuotas_pendientes = it[12];
                        const fecha_vence = it[13];
                        const number = Number(cuotas - cuotas_pendientes);
                        let dia_ini: any = it[14];
                        const fecha_ini = moment(fecha_vence).subtract(number, 'months').format('YYYY-MM');
                        // Datos del contrato
                        const contract: Contract = new Contract();
                        contract.type = 'C';
                        contract.clinichistory = exist.id;
                        const monthContract = it[11] < 10 ? `0${it[11]}` : it[11];
                        contract.date = it[2] !== null ? moment(it[2]).format('YYYY-MM-DD') : moment(`${it[4]}-${monthContract}-01`).format('YYYY-MM-DD');
                        // console.log({ historia: contract.date, num: it[15] });

                        contract.duration = cuotas;
                        contract.amount = it[5];
                        contract.quota = cuotas;
                        contract.exchange_house = 'KAMBISTA SAC - RUC 20601708141';
                        contract.exchange_house_url = 'https://kambista.com/';
                        contract.amount_controls = 100;
                        contract.num = `C${this.lpad(it[15], 4)}`;
                        contract.user = user;
                        contract.executive = it[1];
                        contract.accumulated_credits = it[17];
                        const insertContract = await this.repository.save(contract);
                        if (dia_ini < 10) {
                            dia_ini = `0${dia_ini}`;

                        }

                        let monthQuota = moment(`${fecha_ini}-01`);
                        if (dia_ini > 27 && Number(moment(monthQuota).format('M')) === 2) {
                            const february = moment(monthQuota).format('YYYY-MM');
                            monthQuota = moment(`${february}-27`);
                        } else {
                            monthQuota = moment(`${fecha_ini}-${dia_ini === 31 ? 30 : dia_ini}`);
                        }
                        // const details: ContractDetail[] = [];
                        const det: ContractDetail = new ContractDetail();
                        det.contract = insertContract.id;
                        det.description = 'Inicial';
                        det.observation = '';

                        det.date = moment(monthQuota).format('YYYY-MM-DD');
                        det.amount = it[6];
                        det.balance = 0;
                        det.state = 2;
                        det.quota = 0;
                        det.user = user;
                        await det.save();
                        // details.push(det);

                        for (let i = 0; i < cuotas; i++) {
                            if (dia_ini > 27 && Number(moment(monthQuota).format('M')) === 2) {
                                const february = moment(monthQuota).format('YYYY-MM');
                                monthQuota = moment(`${february}-27`);
                                // console.log({ monthQuota });
                            }
                            const det: ContractDetail = new ContractDetail();
                            det.contract = insertContract.id;
                            det.description = `Cuota ${Number(i + 1)}`;
                            det.quota = Number(i + 1);
                            det.observation = '';
                            det.date = moment(monthQuota).format('YYYY-MM-DD');
                            // console.log({ fecha_det: moment(monthQuota).format('YYYY-MM-DD') });

                            det.amount = it[9];
                            det.balance = i < number ? 0 : it[9]; // it[9];
                            det.state = i < number ? 2 : 1;
                            det.user = user;
                            await det.save();
                            // details.push(det);
                            monthQuota = moment(monthQuota).add(1, 'M');
                        }
                    } catch (error) {
                        console.log({ error });

                    }

                    //console.log({ fecha_ini, cuotas, contract, details });
                    count++;
                }
                count++;
            })
        );
        return count;
    }

    lpad(value: number, padding: number) {
        var zeroes = new Array(padding + 1).join("0");
        return (zeroes + value).slice(-padding);
    }

    async getQuotaPendingClient(idclinichistory: number): Promise<any> {
        return await this.repository.createQueryBuilder('ct')
            .select('extract(days from(now() - cd.date)) days')
            .innerJoin('contract_detail', 'cd', `cd.idcontract = ct.id and cd.balance > 0`)
            .where(`idclinichistory = ${idclinichistory}`)
            .groupBy(`cd.date`)
            .having(`extract(days from(now() - cd.date)) > 0`)
            .getRawOne();

    }

}
