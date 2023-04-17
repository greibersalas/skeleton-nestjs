import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';

import { Audit } from '../../security/audit/audit.entity';
import { QuotationDetail } from './quotation-detail.entity';
import { Quotation } from './quotation.entity';
import { QuotationService } from './quotation.service';

//Reports PDF
import { Pdf_of } from './pdf-of';
import { Pdf_ap } from './pdf-ap';
import { Pdf_ap2 } from './pdf-ap2';
import { Pdf_oi } from './pdf-oi';

@UseGuards(JwtAuthGuard)
@Controller('quotation')
export class QuotationController {

    constructor(private readonly _quotationService: QuotationService) { }

    @Get('/id/:id')
    async getQuotation(@Param('id', ParseIntPipe) id: number): Promise<Quotation> {
        const quotation = await this._quotationService.get(id);
        return quotation;
    }

    @Get('/number/:id')
    async getDetailQuotation(@Param('id', ParseIntPipe) id: number): Promise<QuotationDetail[]> {
        const quotationDetail = await this._quotationService.getDetail(id);
        return quotationDetail;
    }

    @Get()
    async getQuotations(): Promise<Quotation[]> {
        const quotation = await this._quotationService.getAll();
        return quotation;
    }

    @Post("/get/filters/")
    async getFilters(@Body() data: any): Promise<any> {
        return await this._quotationService.getFilters(data);;
    }

    @Get('/reserve/:id')
    async reserveQuotationDetail(@Param('id', ParseIntPipe) id: number, @Body() quotation: QuotationDetail) {
        const update = await this._quotationService.reserveDetail(id);
        return update;
    }

    @Post()
    async createQuotation(
        @Body() quotation: Quotation,
        @Request() req: any
    ): Promise<Quotation> {
        const create = await this._quotationService.create(quotation);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'quotation';
        audit.description = 'Insert registro';
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
    async updateQuotation(
        @Param('id', ParseIntPipe) id: number,
        @Body() quotation: Quotation,
        @Request() req: any
    ) {
        const update = await this._quotationService.update(id, quotation);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'quotation';
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
    async deleteQuotation(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this._quotationService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'quotation';
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

    @Get('get-orden-lab-pending/:id')
    async getOrdenLabs(@Param('id') id: string): Promise<any[]> {
        return await this._quotationService.getLabPending();
    }

    @Get('get-by-clinic-history/:id')
    async getByClinicHistory(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
        return await this._quotationService.getByClinicHistory(id);
    }

    @Get('/get-by-patient/:id')
    async getByPatient(
        @Param('id', ParseIntPipe) id: number
    ): Promise<any> {
        return await this._quotationService.getByPatient(id);
    }

    @Post('add-item/')
    async addItem(
        @Body() item: QuotationDetail,
        @Request() req: any
    ): Promise<QuotationDetail> {
        const create = await this._quotationService.addItem(item);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'quotation';
        audit.description = 'Insert item';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Delete('remove-item/:id')
    async deleteItem(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this._quotationService.deleteItem(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'quotation';
        audit.description = 'Delete item';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return true;
    }

    @Put('update-item/:id')
    async updateItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() item: QuotationDetail,
        @Request() req: any
    ): Promise<any> {
        const update = await this._quotationService.updateItem(id, item);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'quotation';
        audit.description = 'Update item';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Get('pdf/:id/:format')
    async getPdf(@Param('id', ParseIntPipe) id: number, @Param('format') format: string): Promise<any> {
        const data = await this._quotationService.dataPdf(id);

        if (data.detail[0].tariff.id === 131) {
            const pdf = new Pdf_ap2();
            return pdf.print(data);
        } else {
            if (format === 'OF') {
                const pdf = new Pdf_of();
                return pdf.print(data);
            } else if (format === 'AP') {
                const pdf = new Pdf_ap();
                return pdf.print(data);
            } else {
                const pdf = new Pdf_oi();
                return pdf.print(data);
            }
        }
    }
}
