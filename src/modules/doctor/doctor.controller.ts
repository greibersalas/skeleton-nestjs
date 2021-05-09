import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../security/audit/audit.entity';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';

@UseGuards(JwtAuthGuard)
@Controller('doctor')
export class DoctorController {

    constructor(private readonly _doctorService: DoctorService){}

    @Get(':id')
    async getDoctor(@Param('id',ParseIntPipe) id: number): Promise<Doctor>{
        const doctor = await this._doctorService.get(id);
        return doctor;
    }

    @Get()
    async getDoctors(): Promise<Doctor[]>{
        const doctors = await this._doctorService.getAll();
        return doctors;
    }

    @Post()
    async createDoctor(
        @Body() doctor: Doctor,
        @Request() req: any
    ): Promise<Doctor>{
        const create = await this._doctorService.create(doctor);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'doctor';
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
    async updateDoctor(
        @Param('id',ParseIntPipe) id: number,
        @Body() doctor: Doctor,
        @Request() req: any
    ){
        const update = await this._doctorService.update(id,doctor);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'doctor';
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
    async deleteDoctor(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._doctorService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'doctor';
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

    @Post('get-in-bl/:day')
    async getInBl(@Body() id: any, @Param('day',ParseIntPipe) day: number): Promise<Doctor[]>{
        return await this._doctorService.getInBl(id,day);
    }
}
