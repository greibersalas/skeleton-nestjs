import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');
//Excel4Node
import * as xl from 'excel4node';

import { Audit } from '../../security/audit/audit.entity';
import { ClinicHistoryNotes } from './clinic-history-notes.entity';
import { ClinicHistoryNotesService } from './clinic-history-notes.service';

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

    // Reportes
    @Post('/get-report-xlsx/list/historic')
    async getReportXlsxListHistoric(
        @Res() response,
        @Body() filters: any
    ): Promise<any>{
        const { since, until } = filters;
        const data = await this._chnService.getHistorial(since, until);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Notas');
        const styleTitle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                size: 14,
                bold: true
            }
        });
        ws.cell(1,1,1,4,true)
        .string(`Lista de notas`)
        .style(styleTitle);

        ws.cell(2,1,2,4,true)
        .string(``);
        ws.cell(3,1,3,4,true)
        .string(`Filtros: Desde ${moment(since).format('DD-MM-YYYY')} | Hasta ${moment(until).format('DD-MM-YYYY')}`);
        ws.cell(4,1,4,4,true)
        .string(``);

        const style = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#808080',
                fgColor: '#808080',
            },
            font: {
                color: '#ffffff',
                bold: true
            }
        });
        // Filtros en la celdas
        ws.row(5).filter();
        ws.cell(5,1)
        .string("Fecha registro")
        .style(style);
        ws.cell(5,2)
        .string("Doctor")
        .style(style);
        ws.cell(5,3)
        .string("Titulo")
        .style(style);
        ws.cell(5,4)
        .string("Nota")
        .style(style);
        ws.cell(5,5)
        .string("Usuario")
        .style(style);
        ws.cell(5,6)
        .string("Fecha Ult. modificación")
        .style(style);
        ws.cell(5,7)
        .string("Historia")
        .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(40);
        ws.column(4).setWidth(50);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(20);
        let y = 6;
        data.map((it: any) => {
            const {
                title,
                note,
                created,
                last_modification,
                doctor,
                username,
                history,
            } = it;
            ws.cell(y,1)
            .date(new Date(created)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y,2)
            .string(`${doctor}`);
            ws.cell(y,3)
            .string(`${title}`);
            ws.cell(y,4)
            .string(`${note}`);
            ws.cell(y,5)
            .string(`${username}`);
            ws.cell(y,6)
            .date(new Date(last_modification)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y,7)
            .string(`${history}`);
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=file.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }
}
