import {
    Body,
    Controller,
    Delete, Get, Param,
    ParseIntPipe, Post, Put,
    UseGuards, Request
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/strategies/jwt-auth.guard';

import { ExchangeRate } from './entity/exchange-rate.entity';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateDto } from './dto/exchange-rate-dto';
import { Audit } from 'src/modules/security/audit/audit.entity';
const moment = require('moment-timezone');

@UseGuards(JwtAuthGuard)
@Controller('exchange-rate')
export class ExchangeRateController {

    private module = 'exchange-rate';
    constructor(private readonly _ExchangeRateService: ExchangeRateService) { }

    @Get(':id')
    async getExchangeRate(@Param('id', ParseIntPipe) id: number): Promise<ExchangeRateDto> {
        return await this._ExchangeRateService.get(id);
    }

    @Get('/last/rate')
    async getExchangeRateLast(): Promise<ExchangeRateDto> {
        return await this._ExchangeRateService.getLast();
    }

    @Get()
    async getExchangeRates(): Promise<ExchangeRateDto[]> {
        return await this._ExchangeRateService.getAll();
    }

    @Post()
    async createExchangeRate(
        @Body() body: ExchangeRateDto,
        @Request() req: any
    ): Promise<ExchangeRate> {
        const data: ExchangeRate = new ExchangeRate();
        data.coins = body.idcoin;
        data.exchangehouse = body.idexchangehouse;
        data.date = body.date;
        data.value = body.value;
        data.user = req.user.id;
        const create = await this._ExchangeRateService.create(data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = this.module;
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
    async updateExchangeRate(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ExchangeRateDto,
        @Request() req: any
    ) {
        const update = await this._ExchangeRateService.update(id, body, Number(req.user.id));
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Update registro';
        audit.data = JSON.stringify(body);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Delete(':id')
    async deleteExchangeRate(@Param('id', ParseIntPipe) id: number) {
        await this._ExchangeRateService.delete(id);
        return true;
    }
}

