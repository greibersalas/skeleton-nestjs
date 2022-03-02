import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';

import { Audit } from '../../security/audit/audit.entity';
import { Anamnesis } from './anamnesis.entity';
import { AnamnesisService } from './anamnesis.service';

@UseGuards(JwtAuthGuard)
@Controller('anamnesis')
export class AnamnesisController {

    constructor(private readonly _anamnesisService: AnamnesisService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<Anamnesis[]>{
        const anamnesis = await this._anamnesisService.get(id);
        return anamnesis;
    }

    @Get()
    async getAnamnesis(): Promise<Anamnesis[]>{
        const anamnesis = await this._anamnesisService.getAll();
        return anamnesis;
    }

    @Post()
    async createAnamnesis(
        @Body() anamnesis: Anamnesis,
        @Request() req: any
    ): Promise<Anamnesis>{
        const create = await this._anamnesisService.create(anamnesis);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'Anamnesis';
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
    async updateAnamnesis(
        @Param('id',ParseIntPipe) id: number,
        @Body() anamnesis: Anamnesis,
        @Request() req: any
    ){
        const update = await this._anamnesisService.update(id,anamnesis);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'anamnesis';
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
    async deleteAnamnesis(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._anamnesisService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'anamnesis';
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

    @Get('by-clinic-history/:id')
    async getByCH(@Param('id',ParseIntPipe) id: number): Promise<Anamnesis>{
        const anamnesis = await this._anamnesisService.getByCH(id);
        return anamnesis;
    }
}
