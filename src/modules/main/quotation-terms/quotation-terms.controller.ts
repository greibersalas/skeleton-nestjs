import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { QuotationTerms } from './quotation-terms.entity';
import { QuotationTermsService } from './quotation-terms.service';

@Controller('quotation-terms')
export class QuotationTermsController {

    constructor(private readonly _quotationTermsService: QuotationTermsService){}

    @Get(':id')
    async getQuotationTerms(@Param('id',ParseIntPipe) id: number): Promise<QuotationTerms>{
        const quotationTerms = await this._quotationTermsService.get(id);
        return quotationTerms;
    }

    @Get()
    async getQuotationTermss(): Promise<QuotationTerms[]>{
        const quotationTerms = await this._quotationTermsService.getAll();
        return quotationTerms;
    }

    @Post()
    async createQuotationTerms(@Body() quotationTerms: QuotationTerms): Promise<QuotationTerms>{
        const create = await this._quotationTermsService.create(quotationTerms);
        return create;
    }

    @Post('add/many')
    async createQuotationTermsMany(@Body() quotationTerms: any): Promise<boolean>{
        const create = await this._quotationTermsService.createMany(quotationTerms);
        return create;
    }

    @Put(':id')
    async updateQuotationTerms(@Param('id',ParseIntPipe) id: number, @Body() quotationTerms: QuotationTerms){
        const update = await this._quotationTermsService.update(id,quotationTerms);
        return update;
    }

    @Delete(':id')
    async deleteQuotationTerms(@Param('id',ParseIntPipe) id: number){
        await this._quotationTermsService.delete(id);
        return true;
    }

    @Get('quotation/:id')
    async getQuotation(@Param('id',ParseIntPipe) id: number): Promise<QuotationTerms[]>{
        const quotationTerms = await this._quotationTermsService.getByQuotation(id);
        return quotationTerms;
    }
}
