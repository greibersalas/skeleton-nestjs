import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DentalStatus } from './dental-status.entity';
import { DentalStatusService } from './dental-status.service';

@Controller('dental-status')
export class DentalStatusController {

    constructor(private readonly _dentalStatusService: DentalStatusService){}

    @Get(':id')
    async getDentalStatus(@Param('id',ParseIntPipe) id: number): Promise<DentalStatus>{
        const dentalStatus = await this._dentalStatusService.get(id);
        return dentalStatus;
    }

    @Get()
    async getDentalStatuss(): Promise<DentalStatus[]>{
        const dentalStatus = await this._dentalStatusService.getAll();
        return dentalStatus;
    }

    @Post()
    async createDentalStatus(@Body() dentalStatus: DentalStatus): Promise<DentalStatus>{
        const create = await this._dentalStatusService.create(dentalStatus);
        return create;
    }

    @Put(':id')
    async updateDentalStatus(@Param('id',ParseIntPipe) id: number, @Body() dentalStatus: DentalStatus){
        const update = await this._dentalStatusService.update(id,dentalStatus);
        return update;
    }

    @Delete(':id')
    async deleteDentalStatus(@Param('id',ParseIntPipe) id: number){
        await this._dentalStatusService.delete(id);
        return true;
    }
}
