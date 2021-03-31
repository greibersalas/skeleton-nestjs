import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { MouthBreathing } from './mouth-breathing.entity';
import { MouthBreathingService } from './mouth-breathing.service';

@Controller('mouth-breathing')
export class MouthBreathingController {

    constructor(private readonly _mouthBreathingService: MouthBreathingService){}

    @Get(':id')
    async getMouthBreathing(@Param('id',ParseIntPipe) id: number): Promise<MouthBreathing>{
        const mouthBreathing = await this._mouthBreathingService.get(id);
        return mouthBreathing;
    }

    @Get()
    async getMouthBreathings(): Promise<MouthBreathing[]>{
        const mouthBreathing = await this._mouthBreathingService.getAll();
        return mouthBreathing;
    }

    @Post()
    async createMouthBreathing(@Body() mouthBreathing: MouthBreathing): Promise<MouthBreathing>{
        const create = await this._mouthBreathingService.create(mouthBreathing);
        return create;
    }

    @Put(':id')
    async updateMouthBreathing(@Param('id',ParseIntPipe) id: number, @Body() mouthBreathing: MouthBreathing){
        const update = await this._mouthBreathingService.update(id,mouthBreathing);
        return update;
    }

    @Delete(':id')
    async deleteMouthBreathing(@Param('id',ParseIntPipe) id: number){
        await this._mouthBreathingService.delete(id);
        return true;
    }

    @Get('clinic-history/:id')
    async getClinicHistory(@Param('id',ParseIntPipe) id: number): Promise<MouthBreathing>{
        const mouthBreathing = await this._mouthBreathingService.getByClinicHistory(id);
        return mouthBreathing;
    }
}
