import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
import { ClinicHistoryNotes } from './clinic-history-notes.entity';
import { ClinicHistoryNotesService } from './clinic-history-notes.service';
var moment = require('moment-timezone');
import { Audit } from '../../security/audit/audit.entity';

@UseGuards(JwtAuthGuard)
@Controller('clinic-history-notes')
export class ClinicHistoryNotesController {
    constructor(private readonly _chnService: ClinicHistoryNotesService){}

    @Get(':id')
    async getClinicHistoryNotes(@Param('id',ParseIntPipe) id: number): Promise<ClinicHistoryNotes>{
        const clinicHistoryNotes = await this._chnService.get(id);
        return clinicHistoryNotes;
    }

    @Get()
    async getClinicHistoryNotess(): Promise<ClinicHistoryNotes[]>{
        const clinicHistoryNotes = await this._chnService.getAll();
        return clinicHistoryNotes;
    }

    @Post()
    async createClinicHistoryNotes(
        @Body() clinicHistoryNotes: ClinicHistoryNotes,
        @Request() req: any
    ): Promise<ClinicHistoryNotes>{
        clinicHistoryNotes.iduser = Number(req.user.id);
        const create = await this._chnService.create(clinicHistoryNotes);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'clinic-history-notes';
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
    async updateClinicHistoryNotes(
        @Param('id',ParseIntPipe) id: number,
        @Body() clinicHistoryNotes: ClinicHistoryNotes,
        @Request() req: any
    ){
        clinicHistoryNotes.iduser = Number(req.user.id);
        const update = await this._chnService.update(id,clinicHistoryNotes);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'clinic-history-notes';
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
    async deleteClinicHistoryNotes(@Param('id',ParseIntPipe) id: number){
        await this._chnService.delete(id);
        return true;
    }

    @Get('get-patient-notes/:id')
    async getByPatient(@Param('id') id): Promise<ClinicHistoryNotes[]>{
        return await this._chnService.getByPatient(id);
    }
}
