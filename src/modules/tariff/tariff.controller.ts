import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TariffHistory } from './tariff-history.entity';
import { Tariff } from './tariff.entity';
import { TariffService } from './tariff.service';

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
    async createTariff(@Body() tariff: Tariff): Promise<Tariff>{
        const create = await this._tariffService.create(tariff);
        return create;
    }

    @Put(':id')
    async updateTariff(@Param('id',ParseIntPipe) id: number, @Body() tariff: Tariff){
        const actualTariff = await this._tariffService.get(id);
        const update = await this._tariffService.update(id,tariff);
        //INSERT HISTORY OF PRICE
        const history = new TariffHistory()
        history.price_sol_old = actualTariff.price_sol;
        history.price_usd_old = actualTariff.price_usd;
        history.price_sol_new = tariff.price_sol;
        history.price_usd_new = tariff.price_usd;
        history.tariff = actualTariff;
        await this._tariffService.addHistory(history);
        return update;
    }

    @Delete(':id')
    async deleteTariff(@Param('id',ParseIntPipe) id: number){
        await this._tariffService.delete(id);
        return true;
    }

    @Get('get-by-specialty/:idspecialty')
    async getPatient(@Param('idspecialty') idspecialty): Promise<Tariff[]>{
        const tariff = await this._tariffService.getBySpecialty(idspecialty);
        return tariff;
    }
}
