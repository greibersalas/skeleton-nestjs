import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractDetailDto } from './dto/contract-detail-dto';

// Dto
import { ContractDto } from './dto/contract-dto';
import { ContractDetail } from './entity/contract-detail.entity';
import { ContractQuotaPayment } from './entity/contract-quota-payment.entity';

// Entity
import { Contract } from './entity/contract.entity';

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
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient`)
            .innerJoin('so.clinichistory', 'ch')
            .where(where)
            .andWhere(`so.created_at::DATE BETWEEN '${filters.since}' AND '${filters.until}'`)
            .getRawMany();
    }

    async getDataDetail(idcontract: number): Promise<ContractDetailDto[]> {
        return await this.repositoryDetail.createQueryBuilder('dt')
            .select(`dt.id, dt.idcontract, dt.description, dt.observation,
            dt.date, dt.amount, dt.state`)
            .where(`dt.idcontract = ${idcontract}`)
            .andWhere('dt.state <> 0')
            .getRawMany();
    }

    async getDataDetailForPayment(idcontract: number): Promise<ContractDetailDto[]> {
        return await this.repositoryDetail.createQueryBuilder('dt')
            .select(`dt.id, dt.idcontract, dt.description, dt.observation,
            dt.date, dt.amount, dt.state`)
            .where(`dt.idcontract = ${idcontract}`)
            .andWhere('dt.state = 1')
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

    async updateDetailPayment(id: number, idpayment: number): Promise<ContractDetail> {
        const exists = await this.repositoryDetail.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        exists.state = 2;
        exists.quotaPayment = idpayment;
        await exists.save();
        return await this.repositoryDetail.findOne(id);
    }

}
