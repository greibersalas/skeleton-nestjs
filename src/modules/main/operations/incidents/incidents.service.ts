import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const moment = require('moment-timezone');

import { Incidents } from './entity/incident.entity';
import { ViewIncidents } from './entity/incidents-view.entity';
import { IncidentDto } from './dto/incident-dto';

@Injectable()
export class IncidentsService {

    constructor(
        @InjectRepository(Incidents)
        private readonly repository: Repository<Incidents>,
        @InjectRepository(ViewIncidents)
        private readonly view: Repository<ViewIncidents>,
    ) { }

    // Obtenemos todas las notas
    async get(): Promise<IncidentDto[]> {
        return this.view.find();
    }

    // Obtenemos una nota por el id
    async getOne(id: number): Promise<IncidentDto> {
        return this.view.findOne(id);
    }

    async create(data: Incidents): Promise<Incidents> {
        return await this.repository.save(data);
    }

    async update(id: number, data: IncidentDto, iduser: number): Promise<Incidents> {
        const item = await this.repository.findOne(id);
        if (!item) {
            throw new NotFoundException();
        }
        item.arrival_time = data.arrival_time;
        item.office_admission_time = data.office_admission_time;
        item.office_departure_time = data.office_departure_time;
        item.departure_time = data.departure_time;
        item.reason_attendance = data.reason_attendance;
        item.reason = data.reason;
        item.observations = data.observations;
        item.idreservation = data.idreservation;
        item.iddoctor = data.iddoctor;
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
