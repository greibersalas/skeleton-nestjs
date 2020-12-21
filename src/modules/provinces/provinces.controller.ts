import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Provinces } from './provinces.entity';
import { ProvincesService } from './provinces.service';

@Controller('provinces')
export class ProvincesController {
    constructor(private readonly _ProvincesService: ProvincesService){}

    @Get(':id')
    async getProvinces(@Param('id',ParseIntPipe) id: number): Promise<Provinces>{
        const Provinces = await this._ProvincesService.get(id);
        return Provinces;
    }

    @Get()
    async getProvincess(): Promise<Provinces[]>{
        const Provinces = await this._ProvincesService.getAll();
        return Provinces;
    }

    @Post()
    async createProvinces(@Body() Provinces: Provinces): Promise<Provinces>{
        const create = await this._ProvincesService.create(Provinces);
        return create;
    }

    @Put(':id')
    async updateProvinces(@Param('id',ParseIntPipe) id: number, @Body() Provinces: Provinces){
        const update = await this._ProvincesService.update(id,Provinces);
        return update;
    }

    @Delete(':id')
    async deleteProvinces(@Param('id',ParseIntPipe) id: number){
        await this._ProvincesService.delete(id);
        return true;
    }
}
