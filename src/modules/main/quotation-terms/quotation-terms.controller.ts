import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
var moment = require('moment-timezone');
import { QuotationTerms } from './quotation-terms.entity';
import { QuotationTermsService } from './quotation-terms.service';

import { Audit } from '../../security/audit/audit.entity';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
@UseGuards(JwtAuthGuard)@Controller('quotation-terms')
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
    async deleteQuotationTerms(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._quotationTermsService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'Quotation terms';
        audit.description = 'Delete item';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return true;
    }

    @Get('quotation/:id')
    async getQuotation(@Param('id',ParseIntPipe) id: number): Promise<QuotationTerms[]>{
        const quotationTerms = await this._quotationTermsService.getByQuotation(id);
        return quotationTerms;
    }
}
