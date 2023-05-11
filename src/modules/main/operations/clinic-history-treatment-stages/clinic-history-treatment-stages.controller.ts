import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

import { Audit } from 'src/modules/security/audit/audit.entity';
import { ClinicHistoryTreatmentStagesService } from './clinic-history-treatment-stages.service';
import { ClinicHistoryTreatmentStagesDto } from './dto/clinic-history-treatment-stages-dto';
import { ClinicHistoryTreatmentStages } from './entity/clinic-history-treatment-stages.entity';

@UseGuards(JwtAuthGuard)
@Controller('clinic-history-treatment-stages')
export class ClinicHistoryTreatmentStagesController {

    protected module = 'clinic-history-treatment-stages';
    constructor(
        private service: ClinicHistoryTreatmentStagesService
    ) { }

    @Get('clinic-history/:id')
    async getListByClinicHistory(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ClinicHistoryTreatmentStagesDto[]> {
        return await this.service.getByClinicHistory(id);
    }

    @Post()
    async create(
        @Body() data: ClinicHistoryTreatmentStagesDto,
        @Request() req: any
    ): Promise<ClinicHistoryTreatmentStages> {
        const item: ClinicHistoryTreatmentStages = new ClinicHistoryTreatmentStages();
        item.idclinichistory = data.idclinichistory;
        item.idtreatmentstage = data.idtreatmentstage;
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
        @Body() body: ClinicHistoryTreatmentStagesDto,
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
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return await this.service.delete(id);
    }
}
