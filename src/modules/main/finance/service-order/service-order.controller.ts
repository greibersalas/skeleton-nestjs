import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Res, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');
//Excel4Node
import * as xl from 'excel4node';

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';

// Service
import { ServiceOrderService } from './service-order.service';
import { DailyIncomeDto } from './dto/daily-income-view-dto';

// xls
import { ReportDailyPayment } from './xls/report-daily-payments';
import { ReportClinicalAssistance } from './xls/report-clinical-assistance';

@UseGuards(JwtAuthGuard)
@Controller('service-order')
export class ServiceOrderController {

    constructor(
        private service: ServiceOrderService
    ) { }

    @Get('/pending/:date/:status')
    async getDataPending(
        @Param('date') date: string,
        @Param('status', ParseIntPipe) status: number
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataPending(date, status);
    }

    @Put(':id')
    async updateServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ServiceOrderDto,
        @Request() req: any
    ) {
        const update = await this.service.setPaymentData(id, data, Number(req.user.id));
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = data.origin === 'attention' ? 'medical-act-attention' : 'contract-quota-payment';
        audit.description = 'Data del pago y facturación';
        audit.data = JSON.stringify(data);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Put('decline/:id/:origin')
    async declineServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Param('origin') origin: string,
        @Request() req: any
    ) {
        const data = await this.service.setDecline(id, origin);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act-attention';
        audit.description = 'Rechazo de la orden de servicio';
        audit.data = JSON.stringify(data);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return data;
    }

    @Get('/get-daily-income-xlsx/:date/:status')
    async getReportResumeXlsx(
        @Res() response,
        @Param('date') date: string,
        @Param('status', ParseIntPipe) status: number
    ): Promise<any> {
        const data = await this.service.getDailyIncome(date, status);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`Ingresos ${date}`);
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
        ws.cell(1, 1, 1, 11, true)
            .string(`Ingresos de día ${date}`)
            .style(styleTitle);

        const style = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#808080',
            },
            font: {
                color: '#ffffff',
                bold: true
            }
        });
        ws.row(5).filter();
        ws.cell(5, 1)
            .string("Doctor")
            .style(style);
        ws.cell(5, 2)
            .string("Fecha")
            .style(style);
        ws.cell(5, 3)
            .string("Tipo Documento")
            .style(style);
        ws.cell(5, 4)
            .string("DNI Cliente")
            .style(style);
        ws.cell(5, 5)
            .string("Nombre Cliente")
            .style(style);
        ws.cell(5, 6)
            .string("Correo Electr.")
            .style(style);
        ws.cell(5, 7)
            .string("HC")
            .style(style);
        ws.cell(5, 8)
            .string("DNI")
            .style(style);
        ws.cell(5, 9)
            .string("Nombre Paciente")
            .style(style);
        ws.cell(5, 10)
            .string("Edad")
            .style(style);
        ws.cell(5, 11)
            .string("Linea de negocio")
            .style(style);
        ws.cell(5, 12)
            .string("Especialidad")
            .style(style);
        ws.cell(5, 13)
            .string("Tratamiento")
            .style(style);
        ws.cell(5, 14)
            .string("Monto Pagado")
            .style(style);
        // size columns
        ws.column(1).setWidth(25);
        ws.column(2).setWidth(15);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(25);
        ws.column(6).setWidth(25);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(30);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(20);
        ws.column(12).setWidth(20);
        ws.column(13).setWidth(30);
        ws.column(14).setWidth(15);
        let y = 6;
        data.map((it: DailyIncomeDto) => {
            const {
                doctor,
                date,
                type_doc,
                num_doc,
                attorney,
                email,
                history,
                patient_doc_num,
                patient,
                patient_age,
                business_line,
                specialty,
                tariff,
                amount,
                coin
            } = it;
            ws.cell(y, 1)
                .string(`${doctor}`);
            ws.cell(y, 2)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 3)
                .string(`${type_doc === null ? '' : type_doc}`);
            ws.cell(y, 4)
                .string(`${num_doc === null ? '' : num_doc}`);
            ws.cell(y, 5)
                .string(`${attorney === null ? '' : attorney}`);
            ws.cell(y, 6)
                .string(`${email}`);
            ws.cell(y, 7)
                .string(`${history}`);
            ws.cell(y, 8)
                .string(`${patient_doc_num}`);
            ws.cell(y, 9)
                .string(`${patient}`);
            ws.cell(y, 10)
                .number(Number(patient_age));
            ws.cell(y, 11)
                .string(`${business_line}`);
            ws.cell(y, 12)
                .string(`${specialty}`);
            ws.cell(y, 13)
                .string(`${tariff}`);
            ws.cell(y, 14)
                .string(`${coin} ${amount}`);
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=ingresos-diarios.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }

    @Get('/get-report-daily-payment-xlsx/:date')
    async getReportDailyPaymentXlsx(
        @Res() response,
        @Param('date') date: string,
    ): Promise<any> {
        const data = await this.service.getReportDailyPayments(date);
        if (data) {
            const xlsx = new ReportDailyPayment();
            xlsx.onCreate(date, data).then(function (buffer: any) {
                response.set({
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=pagos-diarios.xlsx',
                    'Content-Length': buffer.length
                })

                response.end(buffer);
            });
        } else {
            throw new BadRequestException();
        }
    }

    @Get('/get-report-clinical-assistance-xlsx/:date')
    async getReportClinicalAssitanceXlsx(
        @Res() response,
        @Param('date') date: string,
    ): Promise<any> {
        const data = await this.service.getReportClinicalAssitance(date);
        if (data) {
            const xlsx = new ReportClinicalAssistance();
            xlsx.onCreate(date, data).then(function (buffer: any) {
                response.set({
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=asistencias-clinicas.xlsx',
                    'Content-Length': buffer.length
                })

                response.end(buffer);
            });
        } else {
            throw new BadRequestException();
        }
    }

}
