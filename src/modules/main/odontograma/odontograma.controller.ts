import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { Odontograma } from './odontograma.entity';
import { OdontogramaService } from './odontograma.service';

@Controller('odontograma')
export class OdontogramaController {

    constructor(private readonly _odontogramaService: OdontogramaService){}

    @Get(':id')
    async getOdontograma(@Param('id',ParseIntPipe) id: number): Promise<Odontograma>{
        const Odontograma = await this._odontogramaService.get(id);
        return Odontograma;
    }

    @Get()
    async getOdontogramas(): Promise<Odontograma[]>{
        const odontograma = await this._odontogramaService.getAll();
        return odontograma;
    }

    @Post()
    async createOdontograma(@Body() Odontograma: Odontograma): Promise<Odontograma>{
        const create = await this._odontogramaService.create(Odontograma);
        return create;
    }

    @Put(':id')
    async updateOdontograma(@Param('id',ParseIntPipe) id: number, @Body() odontograma: Odontograma){
        const update = await this._odontogramaService.update(id,odontograma);
        return update;
    }

    @Delete(':id')
    async deleteOdontograma(@Param('id',ParseIntPipe) id: number){
        await this._odontogramaService.delete(id);
        return true;
    }
}
