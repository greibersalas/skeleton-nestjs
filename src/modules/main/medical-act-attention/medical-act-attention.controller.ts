import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { MedicalActAttention } from './medical-act-attention.entity';
import { MedicalActAttentionService } from './medical-act-attention.service';
//Reports PDF
import { PdfPayPatient } from './pdf/pdf-pay-patient';
//Excel4Node
import * as xl from 'excel4node';

@UseGuards(JwtAuthGuard)
@Controller('medical-act-attention')
export class MedicalActAttentionController {

    constructor(private readonly _medicalActAttentionService: MedicalActAttentionService){}

    @Get(':id')
    async getMedicalActAttention(@Param('id',ParseIntPipe) id: number): Promise<MedicalActAttention>{
        const medicalActAttention = await this._medicalActAttentionService.get(id);
        return medicalActAttention;
    }

    @Get()
    async getMedicalActAttentions(): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getAll();
        return medicalActAttention;
    }

    @Post()
    async createMedicalActAttention(
        @Body() medicalActAttention: MedicalActAttention,
        @Request() req: any
    ): Promise<MedicalActAttention>{
        const create = await this._medicalActAttentionService.create(medicalActAttention);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'medical-act-attention';
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
    async updateMedicalActAttention(
        @Param('id',ParseIntPipe) id: number,
        @Body() medicalActAttention: MedicalActAttention,
        @Request() req: any
    ){
        const update = await this._medicalActAttentionService.update(id,medicalActAttention);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act-attention';
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
    async deleteMedicalActAttention(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._medicalActAttentionService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act-attention';
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

    @Get('by-medical-act/:id')
    async getByMedicalAct(@Param('id',ParseIntPipe) id: number): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getByMedicalAct(id);
        return medicalActAttention;
    }

    @Get('by-clinic-history/:id')
    async getByCH(@Param('id',ParseIntPipe) id: number): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getByCH(id);
        return medicalActAttention;
    }

    @Get('attention-cant/:month/:year')
    async getReservationCant(
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ): Promise<any>{
        return this._medicalActAttentionService.cantReservation(month,year);
    }

    //Reports

    @Get('report-treatment-realized/:date/:specialty/:businnesline/:doctor')
    async getReportTR(
        @Param('date') date: string,
        @Param('specialty', ParseIntPipe) specialty: number,
        @Param('businnesline', ParseIntPipe) businnesline: number,
        @Param('doctor', ParseIntPipe) doctor: number
    ): Promise<any>{
        return await this._medicalActAttentionService.treatmentRealized(date,specialty,businnesline,doctor)
    }

    @Get('report-top-10-tariff/:since/:until')
    async getReportTop10Tariff(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any>{
        return await this._medicalActAttentionService.top10Tariff(since,until);
    }

    @Get('report-top-5-specialty/:since/:until')
    async getReportTop5Specialty(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any>{
        return await this._medicalActAttentionService.top5Specialty(since,until);
    }

    @Get('report-tto-by-doctor/:date')
    async getReportTtoByDoctor(
            @Param('date') date: string
    ): Promise<any>{
        return await this._medicalActAttentionService.getTtoByDoctor(date);
    }

    @Post('/get-report-pdf-pay-patient')
    async getReportPdfPayPatient(@Body() filters: any): Promise<any>{
        const pdf = new PdfPayPatient();
        const data = await this._medicalActAttentionService.getPayPatient(filters);
        return pdf.print(data,filters);
    }

    @Post('/get-report-xlsx-pay-patient')
    async getReportXlsxModelState(
        @Res() response,
        @Body() filters: any
    ): Promise<any>{
        const data = await this._medicalActAttentionService.getPayPatient(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Pagos por Paciente');
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
        .string(`Reporte de Pagos por Paciente`)
        .style(styleTitle);

        ws.cell(2,1,2,4,true)
        .string(``);
        ws.cell(3,1,3,4,true)
        .string(`Filtros: Desde ${moment(filters.since).format('DD-MM-YYYY')} | Hasta ${moment(filters.until).format('DD-MM-YYYY')}`);
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
        ws.cell(5,1)
        .string("Nro. Historia")
        .style(style);
        ws.cell(5,2)
        .string("Paciente")
        .style(style);
        ws.cell(5,3)
        .string("Fecha")
        .style(style);
        ws.cell(5,4)
        .string("Total")
        .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(35);
        ws.column(3).setWidth(15);
        ws.column(4).setWidth(15);
        let y = 6;
        data.map((it: any) => {
            const {
                history,
                paciente,
                date,
                moneda,
                total
            } = it;
            ws.cell(y,1)
            .string(`${history}`);
            ws.cell(y,2)
            .string(`${paciente}`);
            ws.cell(y,3)
            .string(`${moment(date).format('DD-MM-YYYY')}`);
            ws.cell(y,4)
            .string(`${moneda} ${total}`);
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
