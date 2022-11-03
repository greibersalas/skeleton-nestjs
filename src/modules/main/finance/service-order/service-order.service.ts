import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

// Entity
import { ServiceOrder } from './entity/service-order.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';
import { ServiceOrderDetail } from './entity/service-order-detail.entity';
import { ok } from 'assert';
import { ServiceOrderDetailDto } from './dto/service-order-detail-dto';

@Injectable()
export class ServiceOrderService {

    constructor(
        @InjectRepository(ServiceOrder)
        private readonly repository: Repository<ServiceOrder>,
        @InjectRepository(ServiceOrderDetail)
        private readonly repositoryDetail: Repository<ServiceOrderDetail>
    ) { }

    async getOne(id: number): Promise<ServiceOrderDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }

        const data = await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.num_doc,
            so.date_doc, ch.history, "ch"."documentNumber" AS patient_doc,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient`)
            .innerJoin('so.clinichistory', 'ch')
            .where({ id })
            .getRawOne();

        if (!data) {
            throw new NotFoundException();
        }

        return data;
    }

    async getAll(): Promise<ServiceOrderDto[]> {
        return await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.num_doc,
            so.date_doc, ch.history, "ch"."documentNumber" AS patient_doc, so.created_at::DATE AS date_order,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient`)
            .innerJoin('so.clinichistory', 'ch')
            .where('so.state <> 0')
            .getRawMany();
    }

    async getDataFilters(filters: any, status = 0): Promise<ServiceOrderDto[]> {
        let where = 'so.state <> 0';
        if (status > 0) {
            where = `so.state = ${status}`;
        }
        return await this.repository.createQueryBuilder('so')
            .select(`so.id, so.type, so.idclinichistory, so.state, so.num_doc,
            so.date_doc, ch.history, "ch"."documentNumber" AS patient_doc, so.created_at::DATE AS date_order,
            concat_ws(' ',"ch"."lastNameFather", "ch"."lastNameMother", ch.name) AS patient,
            sum(case when det.idcoin = 1 then det.total else 0 end) AS total_sol,
            sum(case when det.idcoin = 2 then det.total else 0 end) AS total_usd`)
            .innerJoin('so.clinichistory', 'ch')
            .innerJoin('service_order_detail', 'det', `det.idserviceorder = so.id`)
            .where(where)
            .andWhere(`so.created_at::DATE BETWEEN '${filters.since}' AND '${filters.until}'`)
            .groupBy(`so.id, so.type, so.idclinichistory, so.state, so.num_doc,
            so.date_doc, ch.history, "ch"."documentNumber", so.created_at::DATE,
            "ch"."lastNameFather", "ch"."lastNameMother", ch.name`)
            .getRawMany();
    }

    async getDataDetail(idserviceorder: number): Promise<ServiceOrderDetailDto[]> {
        return await this.repositoryDetail.createQueryBuilder('dt')
            .select(`dt.id, dt.idserviceorder,
            dt.idtariff, dt.idcoin, dt.quantity,
            dt.price, dt.total, dt.idorigin,
            dt.state, tr.name AS tariff,
            co.code AS coin`)
            .innerJoin('tariff', 'tr', 'tr.id = dt.idtariff')
            .innerJoin('coin', 'co', 'co.id = dt.idcoin')
            .where(`dt.idserviceorder = ${idserviceorder}`)
            .andWhere('dt.state <> 0')
            .getRawMany();
    }

    async create(data: ServiceOrder): Promise<ServiceOrder> {
        return await this.repository.save(data);
    }

    async insertDetail(data: ServiceOrderDetail): Promise<any> {
        return this.repositoryDetail.save(data);
    }

    async update(id: number, data: ServiceOrder): Promise<ServiceOrder> {
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

    async setDataInvoice(id: number, data: ServiceOrder): Promise<ServiceOrder> {
        const order = await this.repository.findOne(id);
        if (!order) {
            throw new NotFoundException();
        }
        order.num_doc = data.num_doc;
        order.date_doc = data.date_doc;
        order.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        order.state = 2;
        order.user = data.user;
        await order.save();
        return await this.repository.findOne(id);
    }
}
