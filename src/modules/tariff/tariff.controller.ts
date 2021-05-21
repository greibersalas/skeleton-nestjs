import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Request } from '@nestjs/common';
var moment = require('moment-timezone');
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

import { Audit } from '../security/audit/audit.entity';
import { TariffHistory } from './tariff-history.entity';
import { Tariff } from './tariff.entity';
import { TariffService } from './tariff.service';

@UseGuards(JwtAuthGuard)
@Controller('tariff')
export class TariffController {

    constructor(private readonly _tariffService: TariffService){}

    @Get(':id')
    async getTariff(@Param('id',ParseIntPipe) id: number): Promise<Tariff>{
        const tariff = await this._tariffService.get(id);
        return tariff;
    }

    @Get()
    async getTariffs(): Promise<Tariff[]>{
        const tariff = await this._tariffService.getAll();
        return tariff;
    }

    @Post()
    async createTariff(
        @Body() tariff: Tariff,
        @Request() req: any
    ): Promise<Tariff>{
        const create = await this._tariffService.create(tariff);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = 'tariff';
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
    async updateTariff(
        @Param('id',ParseIntPipe) id: number,
        @Body() tariff: Tariff,
        @Request() req: any
    ){
        const actualTariff = await this._tariffService.get(id);
        //INSERT HISTORY OF PRICE
        const history = new TariffHistory()
        history.price_sol_old = actualTariff.price_sol;
        history.price_usd_old = actualTariff.price_usd;
        history.price_sol_new = tariff.price_sol;
        history.price_usd_new = tariff.price_usd;
        history.tariff = actualTariff;
        await this._tariffService.addHistory(history);
        //tariff.tariffHistory = [history];
        const update = await this._tariffService.update(id,tariff);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'tariff';
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
    async deleteTariff(
        @Param('id',ParseIntPipe) id: number,
        @Request() req: any
    ){
        await this._tariffService.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'tariff';
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

    @Get('get-by-specialty/:idspecialty')
    async getPatient(@Param('idspecialty') idspecialty): Promise<Tariff[]>{
        const tariff = await this._tariffService.getBySpecialty(idspecialty);
        return tariff;
    }

    @Get('get-by-dental-status/:id')
    async getTariffDental(@Param('id') id): Promise<Tariff[]>{
        return await this._tariffService.getByDentalStatus(id);
    }

    @Get('get-labs/all')
    async getLabs(): Promise<Tariff[]>{
        return await this._tariffService.getLabs();
    }

    @Post('/get-by-bl')
    async getByBl(@Body() data: any): Promise<Tariff[]>{
        const tariff = await this._tariffService.getByBl(data);
        return tariff;
    }
}
