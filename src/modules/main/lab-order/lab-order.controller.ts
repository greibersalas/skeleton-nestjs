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

    @Get('get-cant/:date/:job')
    async getByJob(@Param('date') date: Date, @Param('job') job: string): Promise<number>{
        const prog = await this._labOrderService.getCant(date,job);
        return prog;
    }

    @Post('get-production/:filters')
    async getTest(@Body() filters: any): Promise<any>{
        const production = await this._labOrderService.getProduction(filters);
        return production;
    }

    @Post('get-list/filter')
    async getLabOrdersFilters(@Body() filters: any): Promise<LabOrder[]>{
        const labOrder = await this._labOrderService.getAllFilter(filters);
        return labOrder;
    }

    @Get('confirm/:id/:state')
    async confirm(@Param('id',ParseIntPipe) id: number,@Param('state',ParseIntPipe) state: number): Promise<any>{
        const confirm = await this._labOrderService.confirm(id,state);
        return confirm;
    }
}
