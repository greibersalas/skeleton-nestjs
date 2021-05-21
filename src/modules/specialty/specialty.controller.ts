import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../security/audit/audit.entity';
import { Specialty } from './specialty.entity';
import { SpecialtyService } from './specialty.service';

@UseGuards(JwtAuthGuard)
@Controller('specialty')
export class SpecialtyController {

    constructor(private readonly _specialtyService: SpecialtyService){}

    @Get(':id')
    async getSpecialty(@Param('id',ParseIntPipe) id: number): Promise<Specialty>{
        const specialty = await this._specialtyService.get(id);
        return specialty;
    }

    @Get()
    async getSpecialtys(): Promise<Specialty[]>{
        const specialty = await this._specialtyService.getAll();
        return specialty;
    }

    @Post()
    async createSpecialty(
        @Body() specialty: Specialty,
        @Request() req: any
    ): Promise<Specialty>{
        const create = await this._specialtyService.create(specialty);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'specialty';
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
    async updateSpecialty(
        @Param('id',ParseIntPipe) id: number,
        @Body() specialty: Specialty,
        @Request() req: any
    ){
        const update = await this._specialtyService.update(id,specialty);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'specialty';
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
    async deleteSpecialty(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._specialtyService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'specialty';
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

    @Get('get-specialty/:idbusinessline')
    async getPatient(@Param('idbusinessline') idbusinessline): Promise<Specialty[]>{
        const specialty = await this._specialtyService.getByBusinessLine(idbusinessline);
        return specialty;
    }

    @Post('get-by/:bls')
    async getByBl(@Body() data: any): Promise<Specialty[]>{
        const specialty = await this._specialtyService.getByBusinessLines(data);
        return specialty;
    }
}
