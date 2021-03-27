import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { LabOrder } from './lab-order.entity';
import { LabOrderService } from './lab-order.service';

//FPDF
const FPDF = require('./pdf-barcode');
//import * as FPDF from './pdf-barcode';
@Controller('lab-order')
export class LabOrderController {

    constructor(private readonly _labOrderService: LabOrderService){}

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
        let dm: number[] = [50,40];
        const pdf = new FPDF('L','mm',dm);
        pdf.AddPage('L','A4');
        pdf.SetTitle('Test Lab');
        //pdf.SetLeftMargin(15);
        //pdf.SetRightMargin(15);
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
        pdf.Cell(260,20,'Greiber Jesús Salas Coronel',0,0,'L');

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
        pdf.Cell(260,20,'MX121-123456',0,0,'L');

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
        pdf.Cell(130,20,'26-03-2021',0,0,'L');

        /* pdf.SetY(90);
        pdf.SetX(140);
        pdf.Cell(130,40,'',1,0,'L'); */

        pdf.Image('assets/img/logo.jpg',140,90,130,40,'jpg');

        pdf.Code39(10,150,'MX121-123456',3,30);

        pdf.Output('F','uploads/pdf/lab/test.pdf');

        return 'uploads/pdf/lab/test.pdf'
    }
}
