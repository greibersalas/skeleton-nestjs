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
import { ReportPayment } from './xls/report-daily-income';

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

    @Put('validate-payment/:id/:origin/:status')
    async validateServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Param('status', ParseIntPipe) status: number,
        @Param('origin') origin: string,
        @Request() req: any
    ) {
        const data = await this.service.setValidatePayment(id, origin, status);
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
        if (data) {
            const xlsx = new ReportPayment();
            xlsx.onCreate(since, until, status, data).then(function (buffer: any) {
                response.set({
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename=pagos-pendientes.xlsx',
                    'Content-Length': buffer.length
                })
                response.end(buffer);
            });
        } else {
            throw new BadRequestException();
        }

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
