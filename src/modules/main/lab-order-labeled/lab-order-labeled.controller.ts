import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LabOrderLabeled } from './lab-order-labeled.entity';
import { LabOrderLabeledService } from './lab-order-labeled.service';

@Controller('lab-order-labeled')
export class LabOrderLabeledController {

    constructor(private readonly _labOrderLabeledService: LabOrderLabeledService){}

    @Get(':id')
    async getBraket(@Param('id',ParseIntPipe) id: number): Promise<LabOrderLabeled[]>{
        const labOrderLabeled = await this._labOrderLabeledService.get(id);
        return labOrderLabeled;
    }

    @Get()
    async getLabOrderLabeled(): Promise<LabOrderLabeled[]>{
        const labOrderLabeled = await this._labOrderLabeledService.getAll();
        return labOrderLabeled;
    }

    @Post()
    async createLabOrderLabeled(@Body() labOrderLabeled: LabOrderLabeled): Promise<LabOrderLabeled>{
        const create = await this._labOrderLabeledService.create(labOrderLabeled);
        return create;
    }

    @Put(':id')
    async updateLabOrderLabeled(@Param('id',ParseIntPipe) id: number, @Body() labOrderLabeled: LabOrderLabeled){
        const update = await this._labOrderLabeledService.update(id,labOrderLabeled);
        return update;
    }

    @Delete(':id')
    async deleteLabOrderLabeled(@Param('id',ParseIntPipe) id: number){
        await this._labOrderLabeledService.delete(id);
        return true;
    }
}
