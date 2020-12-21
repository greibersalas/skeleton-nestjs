import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Deparments } from './deparments.entity';
import { DeparmentsService } from './deparments.service';

@Controller('Deparments')
export class DeparmentsController {
    constructor(private readonly _DeparmentsService: DeparmentsService){}

    @Get(':id')
    async getDeparments(@Param('id',ParseIntPipe) id: number): Promise<Deparments>{
        const Deparments = await this._DeparmentsService.get(id);
        return Deparments;
    }

    @Get()
    async getDeparmentss(): Promise<Deparments[]>{
        const Deparments = await this._DeparmentsService.getAll();
        return Deparments;
    }

    @Post()
    async createDeparments(@Body() Deparments: Deparments): Promise<Deparments>{
        const create = await this._DeparmentsService.create(Deparments);
        return create;
    }

    @Put(':id')
    async updateDeparments(@Param('id',ParseIntPipe) id: number, @Body() Deparments: Deparments){
        const update = await this._DeparmentsService.update(id,Deparments);
        return update;
    }

    @Delete(':id')
    async deleteDeparments(@Param('id',ParseIntPipe) id: number){
        await this._DeparmentsService.delete(id);
        return true;
    }
}
