import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { Anamnesis } from './anamnesis.entity';
import { AnamnesisService } from './anamnesis.service';

@Controller('anamnesis')
export class AnamnesisController {

    constructor(private readonly _anamnesisService: AnamnesisService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<Anamnesis[]>{
        const anamnesis = await this._anamnesisService.get(id);
        return anamnesis;
    }

    @Get()
    async getAnamnesis(): Promise<Anamnesis[]>{
        const anamnesis = await this._anamnesisService.getAll();
        return anamnesis;
    }

    @Post()
    async createAnamnesis(@Body() anamnesis: Anamnesis): Promise<Anamnesis>{
        const create = await this._anamnesisService.create(anamnesis);
        return create;
    }

    @Put(':id')
    async updateAnamnesis(@Param('id',ParseIntPipe) id: number, @Body() anamnesis: Anamnesis){
        const update = await this._anamnesisService.update(id,anamnesis);
        return update;
    }

    @Delete(':id')
    async deleteAnamnesis(@Param('id',ParseIntPipe) id: number){
        await this._anamnesisService.delete(id);
        return true;
    }
}
