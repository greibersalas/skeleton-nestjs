import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { LabeledStatus } from './labeled-status.entity';
import { LabeledStatusService } from './labeled-status.service';

@Controller('labeled-status')
export class LabeledStatusController {

    constructor(private readonly _labeledStatusService: LabeledStatusService){}

    @Get(':id')
    async getLabeledStatus(@Param('id',ParseIntPipe) id: number): Promise<LabeledStatus>{
        const labeledStatus = await this._labeledStatusService.get(id);
        return labeledStatus;
    }

    @Get()
    async getLabeledStatuss(): Promise<LabeledStatus[]>{
        const labeledStatus = await this._labeledStatusService.getAll();
        return labeledStatus;
    }

    @Post()
    async createLabeledStatus(@Body() labeledStatus: LabeledStatus): Promise<LabeledStatus>{
        const create = await this._labeledStatusService.create(labeledStatus);
        return create;
    }

    @Put(':id')
    async updateLabeledStatus(@Param('id',ParseIntPipe) id: number, @Body() labeledStatus: LabeledStatus){
        const update = await this._labeledStatusService.update(id,labeledStatus);
        return update;
    }

    @Delete(':id')
    async deleteLabeledStatus(@Param('id',ParseIntPipe) id: number){
        await this._labeledStatusService.delete(id);
        return true;
    }
}
