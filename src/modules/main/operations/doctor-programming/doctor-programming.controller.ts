import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');
import { Audit } from 'src/modules/security/audit/audit.entity';

import { DoctorProgrammingService } from './doctor-programming.service';
import { DoctorProgrammingDto } from './dto/doctor-programing-dto';
import { DoctorProgramming } from './entity/doctor-programming.entity';

@UseGuards(JwtAuthGuard)
@Controller('doctor-programming')
export class DoctorProgrammingController {

    protected module = 'doctor-programming';
    constructor(
        private service: DoctorProgrammingService
    ) { }

    @Get('/doctor/:iddoctor')
    async getListByDoctor(
        @Param('iddoctor', ParseIntPipe) iddoctor: number
    ): Promise<DoctorProgrammingDto[]> {
        return await this.service.get(iddoctor);
    }

    @Get(':id')
    async getById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<DoctorProgrammingDto> {
        return await this.service.getOne(id);
    }

    @Post()
    async create(
        @Body() data: DoctorProgrammingDto,
        @Request() req: any
    ): Promise<DoctorProgramming> {
        const item: DoctorProgramming = new DoctorProgramming();
        item.iddoctor = data.iddoctor;
        item.idenvironmentdoctor = data.idenvironmentdoctor;
        item.date_since = new Date(data.date_since);
        item.date_until = new Date(data.date_until);
        item.time_since = data.time_since;
        item.time_until = data.time_until;
        item.interval = data.interval;
        item.idcampus = data.idcampus;
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
        @Body() body: DoctorProgrammingDto,
        @Request() req: any
    ) {
        return await this.service.update(id, body, Number(req.user.id));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
