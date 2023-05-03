import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
const moment = require('moment-timezone');
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';

import { TreatmentStagesService } from './treatment-stages.service';
import { TreatmentStagesDto } from './dtos/treatment-stages-dto';
import { TreatmentStages } from './entity/treatment-stages.entity';
import { Audit } from 'src/modules/security/audit/audit.entity';

@UseGuards(JwtAuthGuard)
@Controller('treatment-stages')
export class TreatmentStagesController {

    private module = 'treatment-stages';
    constructor(
        private service: TreatmentStagesService
    ) { }

    @Get(':id')
    async getBank(
        @Param('id', ParseIntPipe) id: number
    ): Promise<TreatmentStagesDto> {
        return await this.service.get(id);
    }

    @Get()
    async getBanks(): Promise<TreatmentStagesDto[]> {
        return await this.service.getAll();
    }

    @Post()
    async create(
        @Body() data: TreatmentStagesDto,
        @Request() req: any
    ): Promise<TreatmentStages> {
        const item: TreatmentStages = new TreatmentStages();
        item.idtariff = data.idtariff;
        item.name = data.name;
        item.description = data.description;
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
        @Body() body: TreatmentStagesDto,
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
