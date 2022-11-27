import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
var moment = require('moment-timezone');

import { Audit } from '../../security/audit/audit.entity';
import { LabOrder } from './lab-order.entity';
import { LabOrderService } from './lab-order.service';
import { LabOrderLabeledService } from '../lab-order-labeled/lab-order-labeled.service';

//FPDF
const FPDF = require('./pdf-barcode');
//Reports PDF
import { Pdf_lab_resumen } from './pdf/pdf-lab-resume';
import { Pdf_report_elabo_noelabo } from './pdf/pdf-report-elabo-noelabo';
import { Pdf_report_model_state } from './pdf/pdf-report-model-state';
import { Pdf_report_receta_doctor } from './pdf/pdf-report-receta-doctor';
//Excel4Node
import * as xl from 'excel4node';
@UseGuards(JwtAuthGuard)
@Controller('lab-order')
export class LabOrderController {

    constructor(private readonly _labOrderService: LabOrderService,
        private readonly _labOrderLabeledService: LabOrderLabeledService) { }

    @Get(':id')
    async getLabOrder(@Param('id', ParseIntPipe) id: number): Promise<LabOrder> {
        const labOrder = await this._labOrderService.get(id);
        return labOrder;
    }

    @Get()
    async getLabOrders(): Promise<LabOrder[]> {
        const labOrder = await this._labOrderService.getAll();
        return labOrder;
    }

    @Post()
    async createLabOrder(
        @Body() labOrder: LabOrder,
        @Request() req: any
    ): Promise<LabOrder> {
        const create = await this._labOrderService.create(labOrder);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'lab-order';
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
    async updateLabOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() labOrder: LabOrder,
        @Request() req: any
    ) {
        const update = await this._labOrderService.update(id, labOrder);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-order';
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
    async deleteLabOrder(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this._labOrderService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'lab-order';
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

    @Get('get-cant/:date/:job')
    async getByJob(@Param('date') date: Date, @Param('job') job: string): Promise<number> {
        const prog = await this._labOrderService.getCant(date, job);
        return prog;
    }

    @Post('get-production/:filters')
    async getTest(@Body() filters: any): Promise<any> {
        const production = await this._labOrderService.getProduction(filters);
        return production;
    }

    @Post('get-list/filter')
    async getLabOrdersFilters(@Body() filters: any): Promise<LabOrder[]> {
        const labOrder = await this._labOrderService.getAllFilter(filters);
        return labOrder;
    }

    @Get('confirm/:id/:state')
    async confirm(@Param('id', ParseIntPipe) id: number, @Param('state', ParseIntPipe) state: number): Promise<any> {
        const confirm = await this._labOrderService.confirm(id, state);
        return confirm;
    }

    @Get('/pdf/:id')
    async getPdf(@Param('id', ParseIntPipe) id: number): Promise<any> {
        const data = await this._labOrderLabeledService.pdf(id);
        let dm: number[] = [50, 40];
        const pdf = new FPDF('L', 'mm', dm);
        pdf.AddPage('L', 'A4');
        pdf.SetTitle('Retulado Laboratorio');
        pdf.SetFillColor(200, 200, 200);

        pdf.SetFont('Arial', '', 40);
        pdf.SetY(10);
        pdf.SetX(10);
        pdf.Cell(260, 40, '', 1, 0, 'L');
        pdf.SetY(10);
        pdf.SetX(10);
        pdf.Cell(260, 20, 'Nombre:', 0, 0, 'L');
        pdf.SetFont('Arial', 'B', 40);
        pdf.SetY(30);
        pdf.SetX(10);
        pdf.Cell(260, 20, `${data.name} ${data.lastNameFather} ${data.lastNameMother}`, 0, 0, 'L');

        pdf.SetFont('Arial', '', 40);
        pdf.SetY(50);
        pdf.SetX(10);
        pdf.Cell(260, 40, '', 1, 0, 'L');
        pdf.SetY(50);
        pdf.SetX(10);
        pdf.Cell(260, 20, 'Historia:', 0, 0, 'L');
        pdf.SetFont('Arial', 'B', 40);
        pdf.SetY(70);
        pdf.SetX(10);
        pdf.Cell(260, 20, `${data.history}`, 0, 0, 'L');

        pdf.SetFont('Arial', '', 40);
        pdf.SetY(90);
        pdf.SetX(10);
        pdf.Cell(130, 40, '', 1, 0, 'L');
        pdf.SetY(90);
        pdf.SetX(10);
        pdf.Cell(130, 20, 'Fecha: ', 0, 0, 'L');
        pdf.SetFont('Arial', 'B', 40);
        pdf.SetY(110);
        pdf.SetX(10);
        pdf.Cell(130, 20, `${moment(data.date_labeled).tz('America/Lima').format('DD-MM-YYYY')}`, 0, 0, 'L');

        pdf.Image('assets/img/logo.jpg', 140, 90, 130, 40, 'jpg');

        pdf.Code39(10, 150, `${data.history}`, 3, 30);
        const nameFile: string = `lab-labeled-${data.history}-${id}-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F', `uploads/pdf/lab/${nameFile}`);
        let response = { link: `pdf/lab/${nameFile}` }
        return response;
    }

    /* --- REPORTES --- */
    @Post('/get-resume-pdf')
    async getResumePdf(@Body() filters: any): Promise<any> {
        const pdf = new Pdf_lab_resumen();
        const data = await this._labOrderService.getAllFilter(filters);
        return pdf.print(data);
    }

    @Post('/get-resume-xlsx')
    async getReportResumeXlsx(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
        const data = await this._labOrderService.getAllFilter(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(`Listado`);
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
            .string(`Resumen ordenes de laboratorio`)
            .style(styleTitle);

        let filterDate = '';
        if (filters.option === 'e') {
            filterDate = 'Fecha elaboración';
        } else if (filters.option === 'i') {
            filterDate = 'Fecha instalación';
        } else if (filters.option === 'r') {
            filterDate = 'Fecha registro';
        }
        let state = filters.state === '0' ? 'Todos' : filters.state;
        ws.cell(2, 1, 2, 6, true)
            .string(``);
        ws.cell(3, 1, 3, 6, true)
            .string(`Filtros: ${filterDate} Desde ${filters.since} | Hasta ${filters.until} | Estado: ${state}`);
        ws.cell(4, 1, 4, 6, true)
            .string(``);

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
            .string("Asistente")
            .style(style);
        ws.cell(5, 3)
            .string("Nombre del Paciente")
            .style(style);
        ws.cell(5, 4)
            .string("Edad")
            .style(style);
        ws.cell(5, 5)
            .string("HC")
            .style(style);
        ws.cell(5, 6)
            .string("Fecha de ingreso O.L.")
            .style(style);
        ws.cell(5, 7)
            .string("Chip")
            .style(style);
        ws.cell(5, 8)
            .string("Tipo de aparato")
            .style(style);
        ws.cell(5, 9)
            .string("Condición")
            .style(style);
        ws.cell(5, 10)
            .string("Color")
            .style(style);
        ws.cell(5, 11)
            .string("Fecha elaboración")
            .style(style);
        ws.cell(5, 12)
            .string("Fecha instalación")
            .style(style);
        ws.cell(5, 13)
            .string("Hora")
            .style(style);
        ws.cell(5, 14)
            .string("Observación")
            .style(style);
        // size columns
        ws.column(1).setWidth(25);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(45);
        ws.column(4).setWidth(10);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(10);
        ws.column(8).setWidth(30);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(20);
        ws.column(11).setWidth(20);
        ws.column(12).setWidth(20);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(40);
        let y = 6;
        data.map((it: any) => {
            const {
                doctor,
                quotation_detail,
                chip,
                job,
                color,
                instalation,
                elaboration,
                tariff,
                assistant,
                observation,
                date,
                hour
            } = it;
            const { nameQuote } = doctor;
            const { quotation } = quotation_detail;
            const { clinicHistory } = quotation;
            const {
                name,
                lastNameFather,
                lastNameMother,
                birthdate,
                history
            } = clinicHistory;
            ws.cell(y, 1)
                .string(`${nameQuote}`);
            ws.cell(y, 2)
                .string(`${assistant}`);
            ws.cell(y, 3)
                .string(`${name} ${lastNameFather} ${lastNameMother}`);
            const years: number = moment().diff(birthdate, 'years') ? Number(moment().diff(birthdate, 'years')) : 0;
            ws.cell(y, 4)
                .number(years);
            ws.cell(y, 5)
                .string(`${history}`);
            ws.cell(y, 6)
                .date(new Date(date)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 7)
                .string(`${chip ? 'Si' : 'No'}`);
            ws.cell(y, 8)
                .string(`${tariff.name}`);
            ws.cell(y, 9)
                .string(`${job}`);
            ws.cell(y, 10)
                .string(`${color}`);
            ws.cell(y, 11)
                .date(new Date(elaboration)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 12)
                .date(new Date(instalation)).style({ numberFormat: 'dd/mm/yyyy' });
            ws.cell(y, 13)
                .string(`${hour}`);
            ws.cell(y, 14)
                .string(`${observation}`);
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=resume-ordenes-lab.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }

    @Get('get-cant-order/:month/:year')
    async getCant(
        @Param('month', ParseIntPipe) month: number,
        @Param('year', ParseIntPipe) year: number
    ): Promise<any> {
        return this._labOrderService.getCantMonth(month, year);
    }

    @Post('/get-report-pdf-elaborado-noelaborado')
    async getReportPdfElaboNoelabo(@Body() filters: any): Promise<any> {
        const pdf = new Pdf_report_elabo_noelabo();
        const data = await this._labOrderService.getReportElaboNoElabo(filters);
        return pdf.print(data, filters);
    }

    @Post('/get-report-xlsx-elaborado-noelaborado')
    async getReportXlsxElaboNoelabo(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
        const data = await this._labOrderService.getReportElaboNoElabo(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Elaborados vs pendiente');
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
        ws.cell(1, 1, 1, 6, true)
            .string(`Reporte de AOF Elaborados vs pendiente de elaborar`)
            .style(styleTitle);

        ws.cell(2, 1, 2, 6, true)
            .string(``);
        ws.cell(3, 1, 3, 6, true)
            .string(`Filtros: Desde ${moment(filters.since).format('DD-MM-YYYY')} | Hasta ${moment(filters.until).format('DD-MM-YYYY')}`);
        ws.cell(4, 1, 4, 6, true)
            .string(``);

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
        ws.cell(5, 1)
            .string("Nro. Historia")
            .style(style);
        ws.cell(5, 2)
            .string("Paciente")
            .style(style);
        ws.cell(5, 3)
            .string("Elaboración")
            .style(style);
        ws.cell(5, 4)
            .string("Instalación")
            .style(style);
        ws.cell(5, 5)
            .string("Aparato")
            .style(style);
        ws.cell(5, 6)
            .string("Estado")
            .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(15);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(35);
        ws.column(6).setWidth(23);
        let y = 6;
        data.map((it: any) => {
            const {
                history,
                name,
                instalation,
                aparato,
                state
            } = it;
            let estado = state === 1 ? 'Pendiente' : 'Eleborado';
            ws.cell(y, 1)
                .string(`${history}`);
            ws.cell(y, 2)
                .string(`${name}`);
            ws.cell(y, 3)
                .string(`${moment(instalation).subtract(1, 'day').format('DD/MM/YYYY')}`);
            ws.cell(y, 4)
                .string(`${moment(instalation).format('DD/MM/YYYY')}`);
            ws.cell(y, 5)
                .string(`${aparato}`);
            ws.cell(y, 6)
                .string(`${estado}`);
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

    @Post('/get-report-elaborado-production')
    async getReportProduction(@Body() filters: any): Promise<any> {
        return await this._labOrderService.getReportElaboProd(filters);
    }

    @Post('/get-report-by-state')
    async getReportByState(@Body() filters: any): Promise<any> {
        return await this._labOrderService.getReportbyState(filters);
    }

    @Post('/get-report-pdf-model-state')
    async getReportPdfModelState(@Body() filters: any): Promise<any> {
        const pdf = new Pdf_report_model_state();
        const data = await this._labOrderService.getReportModelState(filters);
        return pdf.print(data, filters);
    }

    @Post('/get-report-xlsx-model-state')
    async getReportXlsxModelState(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
        const data = await this._labOrderService.getReportModelState(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('modelos Según estado');
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
        ws.cell(1, 1, 1, 5, true)
            .string(`Reporte de modelos Según estado, HC y Nombre`)
            .style(styleTitle);

        ws.cell(2, 1, 2, 5, true)
            .string(``);
        ws.cell(3, 1, 3, 5, true)
            .string(`Filtros: Desde ${moment(filters.since).format('DD-MM-YYYY')} | Hasta ${moment(filters.until).format('DD-MM-YYYY')}`);
        ws.cell(4, 1, 4, 5, true)
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
            .string("Elaboración")
            .style(style);
        ws.cell(5, 4)
            .string("Aparato")
            .style(style);
        ws.cell(5, 5)
            .string("Estado")
            .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(15);
        ws.column(4).setWidth(35);
        ws.column(5).setWidth(23);
        let y = 6;
        data.map((it: any) => {
            const {
                history,
                patient,
                elaboration,
                aparato,
                job
            } = it;
            ws.cell(y, 1)
                .string(`${history}`);
            ws.cell(y, 2)
                .string(`${patient}`);
            ws.cell(y, 3)
                .string(`${moment(elaboration).format('DD-MM-YYYY')}`);
            ws.cell(y, 4)
                .string(`${aparato}`);
            ws.cell(y, 5)
                .string(`${job}`);
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

    @Post('/get-report-pdf-receta-doctor')
    async getReportPdfRecetaDocotor(@Body() filters: any): Promise<any> {
        const pdf = new Pdf_report_receta_doctor();
        const data = await this._labOrderService.getReportRecetaDoctor(filters);
        return pdf.print(data, filters);
    }

    @Post('/get-report-xlsx-receta-doctor')
    async getReportExcelRecetaDocotor(
        @Res() response,
        @Body() filters: any
    ): Promise<any> {
        const data = await this._labOrderService.getReportRecetaDoctor(filters);
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Recetas por Odontólogo');
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
            .string(`Reporte de Recetas por Odontólogo`)
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
            .string("Doctor")
            .style(style);
        ws.cell(5, 4)
            .string("Aparato")
            .style(style);
        // size columns
        ws.column(1).setWidth(15);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(25);
        ws.column(4).setWidth(30);
        let y = 6;
        data.map((it: any) => {
            const {
                history,
                patient,
                aparato,
                doctor
            } = it;
            ws.cell(y, 1)
                .string(`${history}`);
            ws.cell(y, 2)
                .string(`${patient}`);
            ws.cell(y, 3)
                .string(`${doctor}`);
            ws.cell(y, 4)
                .string(`${aparato}`);
            y++;
        });
        await wb.writeToBuffer().then(function (buffer: any) {
            response.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=RecetaDocotor.xlsx',
                'Content-Length': buffer.length
            })

            response.end(buffer);
        });
    }
}
