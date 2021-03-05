import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { QuotationDetail } from './quotation-detail.entity';
import { Quotation } from './quotation.entity';
import { QuotationService } from './quotation.service';

@Controller('quotation')
export class QuotationController {

    constructor(private readonly _quotationService: QuotationService){}

    @Get(':id')
    async getQuotation(@Param('id',ParseIntPipe) id: number): Promise<Quotation>{
        const quotation = await this._quotationService.get(id);
        return quotation;
    }

    @Get('/number/:id')
    async getDetailQuotation(@Param('id',ParseIntPipe) id: number): Promise<QuotationDetail[]>{
        const quotationDetail = await this._quotationService.getDetail(id);
        return quotationDetail;
    }

    @Get()
    async getQuotations(): Promise<Quotation[]>{
        const quotation = await this._quotationService.getAll();
        return quotation;
    }

    @Get('/reserve/:id')
    async reserveQuotationDetail(@Param('id',ParseIntPipe) id: number, @Body() quotation: QuotationDetail){
        const update = await this._quotationService.reserveDetail(id);
        return update;
    }

    @Post()
    async createQuotation(@Body() quotation: Quotation): Promise<Quotation>{
        const create = await this._quotationService.create(quotation);
        return create;
    }    

    @Put(':id')
    async updateQuotation(@Param('id',ParseIntPipe) id: number, @Body() quotation: Quotation){
        const update = await this._quotationService.update(id,quotation);
        return update;
    }

    @Delete(':id')
    async deleteQuotation(@Param('id',ParseIntPipe) id: number){
        await this._quotationService.delete(id);
        return true;
    }

    @Get('get-orden-lab-pending/:id')
    async getOrdenLabs(@Param('id') id: string): Promise<any[]>{
        return await this._quotationService.getLabPending();
    }

    @Get('get-by-clinic-history/:id')
    async getByClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<any[]>{
        return await this._quotationService.getByClinicHistory(id);
    }

    @Post('add-item/')
    async addItem(@Body() item: QuotationDetail): Promise<QuotationDetail>{
        const create = await this._quotationService.addItem(item);
        return create;
    }

    @Delete('remove-item/:id')
    async deleteItem(@Param('id',ParseIntPipe) id: number){
        await this._quotationService.deleteItem(id);
        return true;
    }
}
