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
import { AttetionsTariffQuantityDto } from './dtos/attentions-tariff-quantity-dto';

@UseGuards(JwtAuthGuard)
@Controller('medical-act-attention')
export class MedicalActAttentionController {

    constructor(private readonly _medicalActAttentionService: MedicalActAttentionService) { }

    @Get(':id')
    async getMedicalActAttention(@Param('id', ParseIntPipe) id: number): Promise<MedicalActAttention> {
        const medicalActAttention = await this._medicalActAttentionService.get(id);
        return medicalActAttention;
    }

    @Get()
    async getMedicalActAttentions(): Promise<MedicalActAttention[]> {
        const medicalActAttention = await this._medicalActAttentionService.getAll();
        return medicalActAttention;
    }

    @Post()
    async createMedicalActAttention(
        @Body() medicalActAttention: MedicalActAttention,
        @Request() req: any
    ): Promise<MedicalActAttention> {
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
        @Param('id', ParseIntPipe) id: number,
        @Body() medicalActAttention: MedicalActAttention,
        @Request() req: any
    ) {
        const update = await this._medicalActAttentionService.update(id, medicalActAttention);
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
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
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
    async getByMedicalAct(@Param('id', ParseIntPipe) id: number): Promise<MedicalActAttention[]> {
        const medicalActAttention = await this._medicalActAttentionService.getByMedicalAct(id);
        return medicalActAttention;
    }

    @Get('by-clinic-history/:idpatient/:idoption/:option')
    async getByCH(
        @Param('idpatient', ParseIntPipe) idpatient: number,
        @Param('idoption', ParseIntPipe) idoption: number,
        @Param('option') option: string
    ): Promise<MedicalActAttention[]> {
        return await this._medicalActAttentionService.getByCH(idpatient, idoption, option);
    }

    @Get('attention-cant/:month/:year')
    async getReservationCant(
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ): Promise<any> {
        return this._medicalActAttentionService.cantReservation(month, year);
    }

    @Get('get-quantity-attentions/:id')
    async getQuantityAttentions(
        @Param('id', ParseIntPipe) id: number
    ): Promise<MedicalActAttention[]> {
        const quantity = await this._medicalActAttentionService.getQuantityAttentions(id);
        return quantity;
    }

    @Get('get-quantity-attentions/tariff/:id')
    async getQuantityAttentionsTariff(
        @Param('id', ParseIntPipe) id: number
    ): Promise<AttetionsTariffQuantityDto[]> {
        return await this._medicalActAttentionService.getQuantityAttentionsTariff(id);
    }

    //Reports

    @Get('report-treatment-realized/:date/:specialty/:businnesline/:doctor')
    async getReportTR(
        @Param('date') date: string,
        @Param('specialty', ParseIntPipe) specialty: number,
        @Param('businnesline', ParseIntPipe) businnesline: number,
        @Param('doctor', ParseIntPipe) doctor: number
    ): Promise<any> {
        return await this._medicalActAttentionService.treatmentRealized(date, specialty, businnesline, doctor)
    }

    @Get('report-top-10-tariff/:since/:until')
    async getReportTop10Tariff(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any> {
        return await this._medicalActAttentionService.top10Tariff(since, until);
    }

    @Get('report-top-5-specialty/:since/:until')
    async getReportTop5Specialty(
        @Param('since') since: string,
        @Param('until') until: string
    ): Promise<any> {
        return await this._medicalActAttentionService.top5Specialty(since, until);
    }

    @Get('report-tto-by-doctor/:date')
    async getReportTtoByDoctor(
        @Param('date') date: string
    ): Promise<any> {
        return await this._medicalActAttentionService.getTtoByDoctor(date);
    }

    @Post('/get-report-pdf-pay-patient')
    async getReportPdfPayPatient(@Body() filters: any): Promise<any> {
        const pdf = new PdfPayPatient();
        const data = await this._medicalActAttentionService.getPayPatient(filters);
        return pdf.print(data, filters);
    }

    @Post('/get-report-xlsx-pay-patient')
    async getReportXlsxModelState(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
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
        ws.cell(1, 1, 1, 4, true)
            .string(`Reporte de Pagos por Paciente`)
            .style(styleTitle);

        ws.cell(2, 1, 2, 4, true)
            .string(``);
        ws.cell(3, 1, 3, 4, true)
            .string(`Filtros: Desde ${moment(filters.since).format('DD-MM-YYYY')} | Hasta ${moment(filters.until).format('DD-MM-YYYY')}`);
        ws.cell(4, 1, 4, 4, true)
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
        ws.cell(5, 1)
            .string("Nro. Historia")
            .style(style);
        ws.cell(5, 2)
            .string("Paciente")
            .style(style);
        ws.cell(5, 3)
            .string("Fecha")
            .style(style);
        ws.cell(5, 4)
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
            ws.cell(y, 1)
                .string(`${history}`);
            ws.cell(y, 2)
                .string(`${paciente}`);
            ws.cell(y, 3)
                .string(`${moment(date).format('DD-MM-YYYY')}`);
            ws.cell(y, 4)
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
    ): Promise<any> {
        const pdf = new PdfDoctorProduction();
        const data = await this._medicalActAttentionService.getDoctorProduction(filters);
        return pdf.print(data, filters);
    }

    @Post('/get-report-xlsx-doctor-production')
    async getReportExcelDocotorProduction(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
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
        const { since, until } = filters;
        ws.row(5).freeze();
        if (filters.iddoctor > 0) {
            ws.cell(1, 1, 1, 15, true)
                .string(`Ingresos detallados del Dr(a) ${data[0].doctor} del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`)
                .style(styleTitle);
        } else {
            ws.cell(1, 1, 1, 15, true)
                .string(`Ingresos detallados del ${moment(since).format('DD/MM/YYYY')} al ${moment(until).format('DD/MM/YYYY')}`)
                .style(styleTitle);
        }
        ws.cell(2, 1, 2, 15, true)
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
        ws.row(5).filter();
        ws.cell(5, 1)
            .string("Fecha")
            .style(style);
        ws.cell(5, 2)
            .string("Sede")
            .style(style);
        ws.cell(5, 3)
            .string("Doctor")
            .style(style);
        ws.cell(5, 4)
            .string("Paciente")
            .style(style);
        ws.cell(5, 5)
            .string("Linea de negocio")
            .style(style);
        ws.cell(5, 6)
            .string("Especialidad")
            .style(style);
        ws.cell(5, 7)
            .string("Tratamiento")
            .style(style);
        ws.cell(5, 8)
            .string("%")
            .style(style);
        ws.cell(5, 9)
            .string("Moneda")
            .style(style);
        ws.cell(5, 10)
            .string("Bruto")
            .style(style);
        ws.cell(5, 11)
            .string("Laboratorio")
            .style(style);
        ws.cell(5, 12)
            .string("Tarjeta/Efectivo")
            .style(style);
        ws.cell(5, 13)
            .string("IGV")
            .style(style);
        ws.cell(5, 14)
            .string("Costos")
            .style(style);
        ws.cell(5, 15)
            .string("Util. Bruta")
            .style(style);
        ws.cell(5, 16)
            .string("Honorarios")
            .style(style);
        // size columns
        ws.column(1).setWidth(15);// A
        ws.column(2).setWidth(10);// B
        ws.column(3).setWidth(30);// C
        ws.column(4).setWidth(30);// D
        ws.column(5).setWidth(20);// E
        ws.column(6).setWidth(20);// F
        ws.column(7).setWidth(12);// G
        ws.column(8).setWidth(8);// H
        ws.column(9).setWidth(12);// I
        ws.column(10).setWidth(12);// J
        ws.column(11).setWidth(15);// K
        ws.column(12).setWidth(12);// L
        ws.column(13).setWidth(12);// M
        ws.column(14).setWidth(12);// N
        ws.column(15).setWidth(12);// O
        ws.column(16).setWidth(12);// O
        let y = 6;
        const style_number = wb.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); -',
        });
        const styleNumberBold = wb.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); -',
            font: {
                size: 12,
                bold: true
            }
        });
        let total_bruto_sol = 0;
        let total_bruto_usd = 0;
        let total_comision_sol = 0;
        let total_comision_usd = 0;
        let total_lab_sol = 0;
        let total_lab_usd = 0;
        let total_igv_sol = 0;
        let total_igv_usd = 0;
        let total_costos_sol = 0;
        let total_costos_usd = 0;
        let total_utilidad_sol = 0;
        let total_utilidad_usd = 0;
        let total_honorario_sol = 0;
        let total_honorario_usd = 0;
        data.map((it: any) => {
            const {
                date,
                patient,
                porcentage,
                cost,
                cost_usd,
                quantity,
                value,
                coin_code,
                idcoin,
                lab_cost,
                commission,
                bl,
                specialty,
                treatment,
                doctor
            } = it;
            let bruto = 0;
            let coin = coin_code;
            let igv = 0;
            let costo = 0;
            let utilidad = 0;
            if (idcoin === 1) {
                bruto = value * quantity;
                igv = bruto - (bruto / 1.18);
                total_bruto_sol += bruto;
                total_comision_sol += (bruto * (commission / 100));
                costo = cost * quantity;
                total_lab_sol += lab_cost;
                total_igv_sol += igv;
                total_costos_sol += cost;
                utilidad = (bruto - (lab_cost + igv + (bruto * (commission / 100)) + cost));
                total_utilidad_sol += utilidad;
                total_honorario_sol += (utilidad * (porcentage / 100));
            } else {
                bruto = value * quantity;
                igv = bruto - (bruto / 1.18);
                total_bruto_usd += bruto;
                total_comision_usd += (bruto * (commission / 100));
                costo = cost_usd * quantity;
                total_lab_usd += lab_cost;
                total_igv_usd += igv;
                total_costos_usd += cost_usd;
                utilidad = (bruto - (lab_cost + igv + (bruto * (commission / 100)) + cost_usd));
                total_utilidad_usd += utilidad;
                total_honorario_usd += (utilidad * (porcentage / 100));
            }
            ws.cell(y, 1)// A
                .string(`${date}`);
            ws.cell(y, 2)// B
                .string(`Miraflores`);
            ws.cell(y, 3)// C
                .string(`${doctor}`);
            ws.cell(y, 4)// D
                .string(`${patient}`);
            ws.cell(y, 5)// E
                .string(`${bl}`);
            ws.cell(y, 6)// F
                .string(`${specialty}`);
            ws.cell(y, 7)// G
                .string(`${treatment}`);
            ws.cell(y, 8)// H
                .number(porcentage);
            ws.cell(y, 9)// I
                .string(coin);
            ws.cell(y, 10)// J
                .number(bruto)
                .style(style_number);
            ws.cell(y, 11)// K
                .number(lab_cost)
                .style(style_number);
            ws.cell(y, 12)// L
                .formula(`I${y}*(${commission}/100)`)
                .style(style_number);
            ws.cell(y, 13)// M
                .number(igv)
                .style(style_number);
            ws.cell(y, 14)// N
                .number(costo)
                .style(style_number);
            ws.cell(y, 15)// O
                .formula(`I${y}-SUM(J${y}:M${y})`)
                .style(style_number);
            ws.cell(y, 16)// P
                .formula(`N${y}*(G${y}/100)`)
                .style(style_number);
            y++;
        });
        ws.cell(y, 3, y, 8, true)
            .string(`Total Sol`).style(styleFooter);
        ws.cell(y + 1, 3, y + 1, 8, true)
            .string(`Total USD`).style(styleFooter);

        // TOTAL BRUTO
        ws.cell(y, 9)
            .number(total_bruto_sol)
            .style(styleNumberBold);
        // TOTAL LAB
        ws.cell(y, 10)
            .number(total_lab_sol)
            .style(styleNumberBold);
        // TOTAL COMISIÓN
        ws.cell(y, 11)
            .number(total_comision_sol)
            .style(styleNumberBold);
        // TOTAL IGV
        ws.cell(y, 12)
            .number(total_igv_sol)
            .style(styleNumberBold);
        // TOTAL COSTOS
        ws.cell(y, 13)
            .number(total_costos_sol)
            .style(styleNumberBold);
        // TOTAL UTILIDAD
        ws.cell(y, 14)
            .number(total_utilidad_sol)
            .style(styleNumberBold);
        // TOTAL HONORARIOS
        ws.cell(y, 15)
            .number(total_honorario_sol)
            .style(styleNumberBold);

        // TOTAL BRUTO USD
        ws.cell(y + 1, 9)
            .number(total_bruto_usd)
            .style(styleNumberBold);
        // TOTAL LAB USD
        ws.cell(y + 1, 10)
            .number(total_lab_usd)
            .style(styleNumberBold);
        // TOTAL COMISIÓN USD
        ws.cell(y + 1, 11)
            .number(total_comision_usd)
            .style(styleNumberBold);
        // TOTAL IGV USD
        ws.cell(y + 1, 12)
            .number(total_igv_usd)
            .style(styleNumberBold);
        // TOTAL COSTOS USD
        ws.cell(y + 1, 13)
            .number(total_costos_usd)
            .style(styleNumberBold);
        // TOTAL UTILIDAD USD
        ws.cell(y + 1, 14)
            .number(total_utilidad_usd)
            .style(styleNumberBold);
        // TOTAL HONORARIOS USD
        ws.cell(y + 1, 15)
            .number(total_honorario_usd)
            .style(styleNumberBold);

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
