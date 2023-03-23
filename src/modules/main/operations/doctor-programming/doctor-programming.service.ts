import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

import { DoctorProgrammingDto } from './dto/doctor-programing-dto';
import { DoctorProgramming } from './entity/doctor-programming.entity';

@Injectable()
export class DoctorProgrammingService {

    constructor(
        @InjectRepository(DoctorProgramming)
        private readonly repository: Repository<DoctorProgramming>
    ) { }

    // Obtenemos todas las programaciones por iddoctor
    get(iddoctor: number): Promise<DoctorProgrammingDto[]> {
        return this.repository.createQueryBuilder('dp')
            .select(`dp.id, dp.iddoctor, dr."nameQuote" as doctor, dp.idenvironmentdoctor,
            ed.name as environmentdoctor, dp.date_since, dp.date_until, dp.time_since,
            dp.time_until, dp.interval, dp.idcampus, ca.name as campus, dp.status`)
            .innerJoin('dp.iddoctor', 'dr')
            .innerJoin('dp.idenvironmentdoctor', 'ed')
            .innerJoin('dp.idcampus', 'ca')
            .where('dp.status <> 0')
            .andWhere(`dp.iddoctor = ${iddoctor}`)
            .orderBy('dp.date_since', 'DESC')
            .addOrderBy('dp.time_since', 'ASC')
            .getRawMany();
    }

    getOne(id: number): Promise<DoctorProgrammingDto> {
        return this.repository.createQueryBuilder('dp')
            .select(`dp.id, dp.iddoctor, dr."nameQuote" as doctor, dp.idenvironmentdoctor,
            ed.name as environmentdoctor, dp.date_since::DATE, dp.date_until::DATE, dp.time_since,
            dp.time_until, dp.interval, dp.idcampus, ca.name as campus, dp.status`)
            .innerJoin('dp.iddoctor', 'dr')
            .innerJoin('dp.idenvironmentdoctor', 'ed')
            .innerJoin('dp.idcampus', 'ca')
            .andWhere(`dp.id = ${id}`)
            .getRawOne();
    }

    async create(data: DoctorProgramming): Promise<DoctorProgramming> {
        return await this.repository.save(data);
    }

    async update(id: number, data: DoctorProgrammingDto, iduser: number): Promise<DoctorProgramming> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        item.idenvironmentdoctor = data.idenvironmentdoctor;
        item.date_since = data.date_since;
        item.date_until = data.date_until;
        item.time_since = data.time_since;
        item.time_until = data.time_until;
        item.interval = data.interval;
        item.idcampus = data.idcampus;
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
