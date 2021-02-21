import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { LabOrder } from './lab-order.entity';
import { LabOrderService } from './lab-order.service';

@Controller('lab-order')
export class LabOrderController {

    constructor(private readonly _labOrderService: LabOrderService){}

    @Get(':id')
    async getLabOrder(@Param('id',ParseIntPipe) id: number): Promise<LabOrder>{
        const labOrder = await this._labOrderService.get(id);
        return labOrder;
    }

    @Get()
    async getLabOrders(): Promise<LabOrder[]>{
        const labOrder = await this._labOrderService.getAll();
        return labOrder;
    }

    @Post()
    async createLabOrder(@Body() labOrder: LabOrder): Promise<LabOrder>{
        const create = await this._labOrderService.create(labOrder);
        return create;
    }

    @Put(':id')
    async updateLabOrder(@Param('id',ParseIntPipe) id: number, @Body() labOrder: LabOrder){
        const update = await this._labOrderService.update(id,labOrder);
        return update;
    }

    @Delete(':id')
    async deleteLabOrder(@Param('id',ParseIntPipe) id: number){
        await this._labOrderService.delete(id);
        return true;
    }
}
