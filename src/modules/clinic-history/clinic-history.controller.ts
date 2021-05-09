import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

import { Audit } from '../security/audit/audit.entity';
import { ClinicHistory } from './clinic-history.entity';
import { ClinicHistoryService } from './clinic-history.service';

//pdf
import { Pdf_ficha } from './pdf/pdf-ficha';

@UseGuards(JwtAuthGuard)
@Controller('clinic-history')
export class ClinicHistoryController {

    constructor(
        private readonly _clinicHistoryService: ClinicHistoryService
    ){}

    @Get(':id')
    async getClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<ClinicHistory>{
        const clinicHistory = await this._clinicHistoryService.get(id);
        return clinicHistory;
    }

    @Get('get-patient/:document')
    async getPatient(@Param('document') document: string): Promise<ClinicHistory>{
        const clinicHistory = await this._clinicHistoryService.getByDocumentNumber(document);
        return clinicHistory;
    }

    @Get()
    async getClinicHistorys(): Promise<ClinicHistory[]>{
        const clinicHistory = await this._clinicHistoryService.getAll();
        return clinicHistory;
    }

    @Post()
    async createClinicHistory(
        @Body() clinicHistory: ClinicHistory,
        @Request() req: any
    ): Promise<ClinicHistory>{
        const create = await this._clinicHistoryService.create(clinicHistory);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'clinic-history';
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
    async updateClinicHistory(
        @Param('id',ParseIntPipe) id: number,
        @Body() clinicHistory: ClinicHistory,
        @Request() req: any
    ){
        const update = await this._clinicHistoryService.update(id,clinicHistory);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'clinic-history';
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
    async deleteClinicHistory(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._clinicHistoryService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'clinic-history';
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

    @Get('get-last-history-number/:campus')
    async getLastHistoryNumber(@Param('campus',ParseIntPipe) campus: number): Promise<number>{
        return await this._clinicHistoryService.getLastHistoryNumber(campus);
    }

    @Get('pdf-ficha/:id')
    async getPdf(@Param('id',ParseIntPipe) id: number): Promise<any>{
        const data = await this._clinicHistoryService.getPdfFichaData(id);
        const pdf = new Pdf_ficha();
        return pdf.print(data);
    }
}
