import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const moment = require('moment-timezone');

import { TreatmentStages } from './entity/treatment-stages.entity';
import { TreatmentStagesDto } from './dtos/treatment-stages-dto';

@Injectable()
export class TreatmentStagesService {

    constructor(
        @InjectRepository(TreatmentStages)
        private readonly repository: Repository<TreatmentStages>
    ) { }

    async get(id: number): Promise<TreatmentStagesDto> {
        if (!id) {
            throw new BadRequestException('id must be send.');
        }
        const data: TreatmentStagesDto = await this.repository.createQueryBuilder('ts')
            .select(`ts.*, tr.name as tariff`)
            .innerJoin('tariff', 'tr', 'tr.id = ts.idtariff')
            .where(`ts.id = ${id}`)
            .getRawOne();
        if (!data) {
            throw new NotFoundException();
        }
        return data;
    }

    async getAll(): Promise<TreatmentStagesDto[]> {
        return await this.repository.createQueryBuilder('ts')
            .select(`ts.*, tr.name as tariff`)
            .innerJoin('tariff', 'tr', 'tr.id = ts.idtariff')
            .where(`ts.status = 1`)
            .orderBy('ts.name', 'ASC')
            .getRawMany();
    }

    async create(data: TreatmentStages): Promise<TreatmentStages> {
        return await this.repository.save(data);
    }

    async update(id: number, body: TreatmentStagesDto, iduser: number): Promise<TreatmentStages> {
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        data.name = body.name;
        data.description = body.description;
        data.user = iduser;
        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        await this.repository.update(id, body);
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const data = await this.repository.findOne(id);
        if (!data) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { status: 0 });
    }
}
