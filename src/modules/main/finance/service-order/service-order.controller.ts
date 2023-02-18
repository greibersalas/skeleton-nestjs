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

    @Get('/pending/:since/:until/:status')
    async getDataPending(
        @Param('since') since: string,
        @Param('until') until: string,
        @Param('status', ParseIntPipe) status: number
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataPending(since, until, status);
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

    @Put('decline/:id/:origin/:status')
    async declineServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Param('status', ParseIntPipe) status: number,
        @Param('origin') origin: string,
        @Request() req: any,
        @Body() body: any
    ) {
        const data = await this.service.setDecline(id, origin, status, body.reason);
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

    @Get('/get-daily-income-xlsx/:since/:until/:status')
    async getReportResumeXlsx(
        @Res() response,
        @Param('since') since: string,
        @Param('until') until: string,
        @Param('status', ParseIntPipe) status: number
    ): Promise<any> {
        const data = await this.service.getDailyIncome(since, until, status);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`Datos`);
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
            .string(`Ingresos del ${since} hasta ${until}`)
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
        if (status === 2) {
            ws.cell(5, 15)
                .string("Metodo de pago")
                .style(style);
            ws.cell(5, 16)
                .string("Cuenta bancaria")
                .style(style);
            ws.cell(5, 17)
                .string("Num. Operación")
                .style(style);
            ws.cell(5, 18)
                .string("Tipo doc.")
                .style(style);
            ws.cell(5, 19)
                .string("Num. doc.")
                .style(style);
            ws.cell(5, 20)
                .string("Fecha doc.")
                .style(style);
        }
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
        ws.column(14).setWidth(20);
        if (status === 2) {
            ws.column(15).setWidth(20);
            ws.column(16).setWidth(30);
            ws.column(17).setWidth(20);
            ws.column(18).setWidth(15);
            ws.column(19).setWidth(15);
            ws.column(20).setWidth(15);
        }
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
                coin,
                payment_method,
                bank_account,
                operation_number,
                document_type,
                document_number,
                document_date

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
            if (status === 2) {
                ws.cell(y, 15)
                    .string(`${payment_method}`);
                ws.cell(y, 16)
                    .string(`${bank_account}`);
                ws.cell(y, 17)
                    .string(`${operation_number}`);
                ws.cell(y, 18)
                    .string(`${document_type === 'invoice' ? 'Factura' : 'Boleta'}`);
                ws.cell(y, 19)
                    .string(`${document_number}`);
                ws.cell(y, 20)
                    .date(new Date(document_date)).style({ numberFormat: 'dd/mm/yyyy' });
            }
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

    @Get('/get-report-daily-payment-xlsx/:since/:until')
    async getReportDailyPaymentXlsx(
        @Res() response,
        @Param('since') since: string,
        @Param('until') until: string,
    ): Promise<any> {
        const data = await this.service.getReportDailyPayments(since, until);
        if (data) {
            const xlsx = new ReportDailyPayment();
            xlsx.onCreate(`${since} - ${until}`, data).then(function (buffer: any) {
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

    @Get('/get-report-clinical-assistance-xlsx/:since/:until')
    async getReportClinicalAssitanceXlsx(
        @Res() response,
        @Param('since') since: string,
        @Param('until') until: string,
    ): Promise<any> {
        const data = await this.service.getReportClinicalAssitance(since, until);
        if (data) {
            const xlsx = new ReportClinicalAssistance();
            xlsx.onCreate(`${since} - ${until}`, data).then(function (buffer: any) {
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
