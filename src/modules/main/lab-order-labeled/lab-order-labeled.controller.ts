import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { LabOrderLabeled } from './lab-order-labeled.entity';
import { LabOrderLabeledService } from './lab-order-labeled.service';

@UseGuards(JwtAuthGuard)
@Controller('lab-order-labeled')
export class LabOrderLabeledController {

    constructor(private readonly _labOrderLabeledService: LabOrderLabeledService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<LabOrderLabeled[]>{
        const labOrderLabeled = await this._labOrderLabeledService.get(id);
        return labOrderLabeled;
    }

    @Get()
    async getLabOrderLabeled(): Promise<LabOrderLabeled[]>{
        const labOrderLabeled = await this._labOrderLabeledService.getAll();
        return labOrderLabeled;
    }

    @Post()
    async createLabOrderLabeled(
        @Body() labOrderLabeled: LabOrderLabeled,
        @Request() req: any
    ): Promise<LabOrderLabeled>{
        const create = await this._labOrderLabeledService.create(labOrderLabeled);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'lab-order-labeled';
        audit.description = 'Insertar registro';
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
    async updateLabOrderLabeled(
        @Param('id',ParseIntPipe) id: number,
        @Body() labOrderLabeled: LabOrderLabeled,
        @Request() req: any
    ){
        const update = await this._labOrderLabeledService.update(id,labOrderLabeled);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-order-labeled';
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Delete(':id')
    async deleteLabOrderLabeled(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._labOrderLabeledService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-order-labeled';
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return true;
    }
}
