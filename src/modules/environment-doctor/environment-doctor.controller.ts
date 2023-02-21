import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../security/audit/audit.entity';
import { EnvironmentDoctor } from './environment-doctor.entity';
import { EnvironmentDoctorService } from './environment-doctor.service';
import { ReservationService } from '../reservation/reservation.service';

@UseGuards(JwtAuthGuard)
@Controller('environment-doctor')
export class EnvironmentDoctorController {
    constructor(private readonly _edService: EnvironmentDoctorService,
        private readonly _reservationService: ReservationService) { }

    @Get(':id')
    async getEnvironmentDoctor(@Param('id', ParseIntPipe) id: number): Promise<EnvironmentDoctor> {
        const ed = await this._edService.get(id);
        return ed;
    }

    @Get()
    async getEnvironmentDoctors(): Promise<EnvironmentDoctor[]> {
        const ed = await this._edService.getAll();
        return ed;
    }

    @Get('campus/:idcampus')
    async getByCampus(@Param('idcampus', ParseIntPipe) idcampus: number): Promise<EnvironmentDoctor[]> {
        const ed = await this._edService.getByCampus(idcampus);
        return ed;
    }

    @Post()
    async createEnvironmentDoctor(
        @Body() ed: EnvironmentDoctor,
        @Request() req: any
    ): Promise<EnvironmentDoctor> {
        const create = await this._edService.create(ed);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'environtment-doctor';
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
    async updateEnvironmentDoctor(
        @Param('id', ParseIntPipe) id: number,
        @Body() ed: EnvironmentDoctor,
        @Request() req: any
    ) {
        const update = await this._edService.update(id, ed);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'environtment-doctor';
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
    async deleteEnvironmentDoctor(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this._edService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'environtment-doctor';
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

    @Get('programmin-day/:date/:campus/:doctor/:patient/:state')
    async getProgrammingDay(
        @Param('date') date: string,
        @Param('campus', ParseIntPipe) campus: number,
        @Param('doctor', ParseIntPipe) doctor: number,
        @Param('patient', ParseIntPipe) patient: number,
        @Param('state', ParseIntPipe) state: number,
        @Request() req: any
    ): Promise<any> {
        const { user } = req;
        //idroles 4 y 5 Doctor y Especialista OFM
        let rol: boolean = false;
        if (user.roles.idrole === 4 || user.roles.idrole === 4) {
            rol = true;
        }
        const reser = await this._reservationService.getByDay(date, campus);
        const programmming = await this._edService.programmingDay(date, reser, campus, doctor, patient, state, rol);
        return programmming;
    }
}
