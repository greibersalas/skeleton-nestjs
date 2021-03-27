import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { LabOrder } from './lab-order.entity';
import { LabOrderService } from './lab-order.service';
import { LabOrderLabeledService } from '../lab-order-labeled/lab-order-labeled.service';
var moment = require('moment-timezone');

//FPDF
const FPDF = require('./pdf-barcode');
//import * as FPDF from './pdf-barcode';
@Controller('lab-order')
export class LabOrderController {

    constructor(private readonly _labOrderService: LabOrderService,
        private readonly _labOrderLabeledService: LabOrderLabeledService){}

    @Get(':id')
    async getLabOrder(@Param('id',ParseIntPipe) id: number): Promise<LabOrder>{
        const labOrder = await this._labOrderService.get(id);
        return labOrder;
    }

    @Get()
    async getLabOrders(): Promise<LabOrder[]>{
        const labOrder = await this._labOrderService.getAll();
        return labOrder;
    }

    @Post()
    async createLabOrder(@Body() labOrder: LabOrder): Promise<LabOrder>{
        const create = await this._labOrderService.create(labOrder);
        return create;
    }

    @Put(':id')
    async updateLabOrder(@Param('id',ParseIntPipe) id: number, @Body() labOrder: LabOrder){
        const update = await this._labOrderService.update(id,labOrder);
        return update;
    }

    @Delete(':id')
    async deleteLabOrder(@Param('id',ParseIntPipe) id: number){
        await this._labOrderService.delete(id);
        return true;
    }

    @Get('get-cant/:date/:job')
    async getByJob(@Param('date') date: Date, @Param('job') job: string): Promise<number>{
        const prog = await this._labOrderService.getCant(date,job);
        return prog;
    }

    @Post('get-production/:filters')
    async getTest(@Body() filters: any): Promise<any>{
        const production = await this._labOrderService.getProduction(filters);
        return production;
    }

    @Post('get-list/filter')
    async getLabOrdersFilters(@Body() filters: any): Promise<LabOrder[]>{
        const labOrder = await this._labOrderService.getAllFilter(filters);
        return labOrder;
    }

    @Get('confirm/:id/:state')
    async confirm(@Param('id',ParseIntPipe) id: number,@Param('state',ParseIntPipe) state: number): Promise<any>{
        const confirm = await this._labOrderService.confirm(id,state);
        return confirm;
    }

    @Get('pdf/:id')
    async getPdf(@Param('id',ParseIntPipe) id: number): Promise<any>{
        const data = await this._labOrderLabeledService.pdf(id);
        let dm: number[] = [50,40];
        const pdf = new FPDF('L','mm',dm);
        pdf.AddPage('L','A4');
        pdf.SetTitle('Retulado Laboratorio');
        pdf.SetFillColor(200,200,200);

        pdf.SetFont('Arial','',40);
        pdf.SetY(10);
        pdf.SetX(10);
        pdf.Cell(260,40,'',1,0,'L');
        pdf.SetY(10);
        pdf.SetX(10);
        pdf.Cell(260,20,'Nombre:',0,0,'L');
        pdf.SetFont('Arial','B',40);
        pdf.SetY(30);
        pdf.SetX(10);
        pdf.Cell(260,20,`${data.name} ${data.lastNameFather} ${data.lastNameMother}`,0,0,'L');

        pdf.SetFont('Arial','',40);
        pdf.SetY(50);
        pdf.SetX(10);
        pdf.Cell(260,40,'',1,0,'L');
        pdf.SetY(50);
        pdf.SetX(10);
        pdf.Cell(260,20,'Historia:',0,0,'L');
        pdf.SetFont('Arial','B',40);
        pdf.SetY(70);
        pdf.SetX(10);
        pdf.Cell(260,20,`${data.history}`,0,0,'L');

        pdf.SetFont('Arial','',40);
        pdf.SetY(90);
        pdf.SetX(10);
        pdf.Cell(130,40,'',1,0,'L');
        pdf.SetY(90);
        pdf.SetX(10);
        pdf.Cell(130,20,'Fecha: ',0,0,'L');
        pdf.SetFont('Arial','B',40);
        pdf.SetY(110);
        pdf.SetX(10);
        pdf.Cell(130,20,`${moment(data.date_labeled).tz('America/Lima').format('DD-MM-YYYY')}`,0,0,'L');

        pdf.Image('assets/img/logo.jpg',140,90,130,40,'jpg');

        pdf.Code39(10,150,`${data.history}`,3,30);
        const nameFile: string = `lab-labeled-${data.history}-${id}-${moment().tz('America/Lima').format('YYYYMMDDHHmmss')}.pdf`;
        pdf.Output('F',`uploads/pdf/lab/${nameFile}`);
        let response = {link: `pdf/lab/${nameFile}`}
        return response;
    }
}
