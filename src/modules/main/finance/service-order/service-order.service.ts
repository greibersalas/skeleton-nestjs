import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity
import { ServiceOrder } from './entity/service-order.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';
import { ServiceOrderDetail } from './entity/service-order-detail.entity';
import { ok } from 'assert';

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
}
