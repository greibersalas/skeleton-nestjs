import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

import { Audit } from 'src/modules/security/audit/audit.entity';
import { IncidentsService } from './incidents.service';
import { IncidentDto } from './dto/incident-dto';
import { Incidents } from './entity/incident.entity';

@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {

    protected module = 'incidents';
    constructor(
        private service: IncidentsService
    ) { }

    @Get()
    async getListByDoctor(): Promise<IncidentDto[]> {
        return await this.service.get();
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<IncidentDto> {
        return await this.service.getOne(id);
    }

    @Post()
    async create(
        @Body() data: IncidentDto,
        @Request() req: any
    ): Promise<Incidents> {
        const item: Incidents = new Incidents();
        item.idclinichistory = data.idclinichistory;
        item.date = data.date;
        item.arrival_time = data.arrival_time;
        item.office_admission_time = data.office_admission_time;
        item.office_departure_time = data.office_departure_time;
        item.departure_time = data.departure_time;
        item.reason_attendance = data.reason_attendance;
        item.reason = data.reason;
        item.observations = data.observations;
        item.idreservation = data.idreservation;
        item.user = req.user.id;
        const create = await this.service.create(item);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = this.module;
        audit.description = 'Insert registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: IncidentDto,
        @Request() req: any
    ) {
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Update registro';
        audit.data = JSON.stringify(body);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return await this.service.update(id, body, Number(req.user.id));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
