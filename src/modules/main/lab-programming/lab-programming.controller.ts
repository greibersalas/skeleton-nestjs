import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { LabProgramming } from './lab-programming.entity';
import { LabProgrammingService } from './lab-programming.service';

@UseGuards(JwtAuthGuard)
@Controller('lab-programming')
export class LabProgrammingController {

    constructor(private readonly _labProgrammingService: LabProgrammingService){}

    @Get(':id')
    async getLabProgramming(@Param('id',ParseIntPipe) id: number): Promise<LabProgramming>{
        const labProgramming = await this._labProgrammingService.get(id);
        return labProgramming;
    }

    @Get()
    async getLabProgrammings(): Promise<LabProgramming[]>{
        const labProgramming = await this._labProgrammingService.getAll();
        return labProgramming;
    }

    @Post()
    async createLabProgramming(
        @Body() labProgramming: LabProgramming,
        @Request() req: any
    ): Promise<LabProgramming>{
        const create = await this._labProgrammingService.create(labProgramming);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'lab-programming';
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
    async updateLabProgramming(
        @Param('id',ParseIntPipe) id: number,
        @Body() labProgramming: LabProgramming,
        @Request() req: any
    ){
        const update = await this._labProgrammingService.update(id,labProgramming);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-programming';
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
    async deleteLabProgramming(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._labProgrammingService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-programming';
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

    @Get('validate-date/:date/:job')
    async validateDate(@Param('date') date: Date, @Param('job') job: string): Promise<boolean>{
        const exists = await this._labProgrammingService.validateDate(date,job);
        return exists;
    }

    @Get('get-by-job/:date/:job')
    async getByJob(@Param('date') date: Date, @Param('job') job: string): Promise<LabProgramming>{
        const prog = await this._labProgrammingService.getByJob(date,job);
        return prog;
    }
}
