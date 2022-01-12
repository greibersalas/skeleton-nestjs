import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { MedicalActAttention } from './medical-act-attention.entity';
import { MedicalActAttentionService } from './medical-act-attention.service';
//Reports PDF
import { PdfPayPatient } from './pdf/pdf-pay-patient';
import { PdfDoctorProduction } from './pdf/pdf-doctor-production';
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

    @Get('by-clinic-history/:id/:iddoctor')
    async getByCH(
        @Param('id',ParseIntPipe) id: number,
        @Param('iddoctor',ParseIntPipe) iddoctor: number
    ): Promise<MedicalActAttention[]>{
        const medicalActAttention = await this._medicalActAttentionService.getByCH(id,iddoctor);
        return medicalActAttention;
    }

    @Get('attention-cant/:month/:year')
    async getReservationCant(
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ): Promise<any>{
        return this._medicalActAttentionService.cantReservation(month,year);
    }

    @Get('get-quantity-attentions/:id')
    async getQuantityAttentions(
        @Param('id',ParseIntPipe) id: number
    ): Promise<MedicalActAttention[]>{
        const quantity = await this._medicalActAttentionService.getQuantityAttentions(id);
        return quantity;
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

    @Post('/get-report-pdf-doctor-production')
    async getReportPdfDoctorProduction(
        @Body() filters: any
    ): Promise<any>{
        const pdf = new PdfDoctorProduction();
        const data = await this._medicalActAttentionService.getDoctorProduction(filters);
        return pdf.print(data,filters);
    }

    @Post('/get-report-xlsx-doctor-production')
    async getReportExcelDocotorProduction(
        @Res() response,
        @Body() filters: any
    ): Promise<any>{
        const data = await this._medicalActAttentionService.getDoctorProduction(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Producción');
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
        const styleFooter = wb.createStyle({
            alignment: {
                horizontal: ['right'],
                vertical: ['bottom']
            },
            font: {
                size: 12,
                bold: true
            }
        });
        const { since,until } = filters;
        ws.cell(1,1,1,9,true)
        .string(`Ingresos detallados del Dr(a) ${data[0].doctor} del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`)
        .style(styleTitle);
        ws.cell(2,1,2,9,true)
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
        .string("Fecha")
        .style(style);
        ws.cell(5,2)
        .string("Sede")
        .style(style);
        ws.cell(5,3)
        .string("Paciente")
        .style(style);
        ws.cell(5,4)
        .string("%")
        .style(style);
        ws.cell(5,5)
        .string("Unit.")
        .style(style);
        ws.cell(5,6)
        .string("Cant.")
        .style(style);
        ws.cell(5,7)
        .string("Bruto")
        .style(style);
        ws.cell(5,8)
        .string("Moneda")
        .style(style);
        ws.cell(5,9)
        .string("Honorario")
        .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(15);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(8);
        ws.column(5).setWidth(10);
        ws.column(6).setWidth(10);
        ws.column(7).setWidth(10);
        ws.column(8).setWidth(8);
        ws.column(9).setWidth(10);
        let y = 6;
        const style_number = wb.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); -',
        });
        let total_bruto_sol = 0;
        let total_bruto_usd = 0;
        let total_neto_sol = 0;
        let total_neto_usd = 0;
        data.map((it: any) => {
            const {
                date,
                patient,
                porcentage,
                price_sol,
                cost,
                price_usd,
                cost_usd,
                quantity,
                value,
                coin_code,
                idcoin
            } = it;
            let unit_price = (value/1.18);
            let bruto = 0;
            let neto = 0;
            let coin = 'S/';
            if(price_sol > 0){
                unit_price = unit_price-cost;
                bruto = unit_price*quantity;
                neto = (bruto/Number(`1.${porcentage}`));
                total_bruto_sol += bruto;
                total_neto_sol += neto;
            }else{
                unit_price = unit_price-cost_usd;
                bruto = unit_price*quantity;
                neto = (bruto/Number(`1.${porcentage}`));
                total_bruto_usd += bruto;
                total_neto_usd += neto;
                coin = '$';
            }
            ws.cell(y,1)
            .string(`${date}`);
            ws.cell(y,2)
            .string(`Miraflores`);
            ws.cell(y,3)
            .string(`${patient}`);
            ws.cell(y,4)
            .number(porcentage);
            ws.cell(y,5)
            .number(unit_price)
            .style(style_number);
            ws.cell(y,6)
            .number(quantity);
            ws.cell(y,7)
            .number(bruto)
            .style(style_number);
            ws.cell(y,8)
            .string(`${coin}`);
            ws.cell(y,9)
            .number(neto)
            .style(style_number);
            y++;
        });
        ws.cell(y,3,y,6,true)
        .string(`Total Sol`).style(styleFooter);
        ws.cell(y+1,3,y+1,6,true)
        .string(`Total USD`).style(styleFooter);
        ws.cell(y, 7)
        .number(total_bruto_sol)
        .style(style_number);
        ws.cell(y, 9)
        .number(total_neto_sol)
        .style(style_number);
        ws.cell(y+1, 7)
        .number(total_bruto_usd)
        .style(style_number);
        ws.cell(y+1, 9)
        .number(total_neto_usd)
        .style(style_number);
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=ProduccionDocotor.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }
}
