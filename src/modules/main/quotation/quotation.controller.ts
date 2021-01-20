import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { QuotationDto } from './dto/quotation.dto';
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

    @Get()
    async getQuotations(): Promise<Quotation[]>{
        const quotation = await this._quotationService.getAll();
        return quotation;
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
}
