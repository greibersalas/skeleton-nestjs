import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

import { ClinicHistoryTreatmentStages } from './entity/clinic-history-treatment-stages.entity';
import { ClinicHistoryTreatmentStagesDto } from './dto/clinic-history-treatment-stages-dto';

@Injectable()
export class ClinicHistoryTreatmentStagesService {

    constructor(
        @InjectRepository(ClinicHistoryTreatmentStages)
        private readonly repository: Repository<ClinicHistoryTreatmentStages>
    ) { }

    async getByClinicHistory(idclinichistory: number): Promise<ClinicHistoryTreatmentStagesDto[]> {
        return this.repository.createQueryBuilder('ts')
            .select(`ts.id, ts.idclinichistory, ts.idtreatmentstage, ts.status,
            ts.created_at::DATE as date, ta.name as treatment, st.name as stage,
            st.idtariff as idtreatment`)
            .innerJoin('treatment_stages', 'st', 'st.id = ts.idtreatmentstage')
            .innerJoin('tariff', 'ta', 'ta.id = st.idtariff')
            .where(`ts.idclinichistory = ${idclinichistory}`)
            .andWhere('ts.status <> 0')
            .orderBy('ts.created_at::DATE', 'ASC')
            .getRawMany();
    }

    async create(data: ClinicHistoryTreatmentStages): Promise<ClinicHistoryTreatmentStages> {
        // Paso a completado la etapa actual
        await this.repository.createQueryBuilder('up')
            .update(ClinicHistoryTreatmentStages)
            .set({ status: 2 })
            .where(`idclinichistory = ${data.idclinichistory}`)
            .andWhere('status <> 0')
            .execute();
        return await this.repository.save(data);
    }

    async update(id: number, data: ClinicHistoryTreatmentStagesDto, iduser: number): Promise<ClinicHistoryTreatmentStages> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        item.idclinichistory = data.idclinichistory;
        item.idtreatmentstage = data.idtreatmentstage;
        item.user = iduser;
        item.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        await item.save();
        return await this.repository.findOne(id);
    }

    async delete(id: number): Promise<void> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        await this.repository.update(id, { status: 0 });
    }
}
