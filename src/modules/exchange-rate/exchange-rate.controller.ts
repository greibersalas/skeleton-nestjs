import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ExchangeRate } from './exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';

@Controller('exchange-rate')
export class ExchangeRateController {
    constructor(private readonly _ExchangeRateService: ExchangeRateService){}

    @Get(':id')
    async getExchangeRate(@Param('id',ParseIntPipe) id: number): Promise<ExchangeRate>{
        const ExchangeRate = await this._ExchangeRateService.get(id);
        return ExchangeRate;
    }

    @Get()
    async getExchangeRates(): Promise<ExchangeRate[]>{
        const ExchangeRate = await this._ExchangeRateService.getAll();
        return ExchangeRate;
    }

    @Post()
    async createExchangeRate(@Body() ExchangeRate: ExchangeRate): Promise<ExchangeRate>{
        const create = await this._ExchangeRateService.create(ExchangeRate);
        return create;
    }

    @Put(':id')
    async updateExchangeRate(@Param('id',ParseIntPipe) id: number, @Body() ExchangeRate: ExchangeRate){
        const update = await this._ExchangeRateService.update(id,ExchangeRate);
        return update;
    }

    @Delete(':id')
    async deleteExchangeRate(@Param('id',ParseIntPipe) id: number){
        await this._ExchangeRateService.delete(id);
        return true;
    }
}

