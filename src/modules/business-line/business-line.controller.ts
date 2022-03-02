import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

import { BusinessLine } from './business-line.entity';
import { BusinessLineService } from './business-line.service';

@UseGuards(JwtAuthGuard)
@Controller('business-line')
export class BusinessLineController {
    constructor(private readonly _businessLineService: BusinessLineService){}

    @Get(':id')
    async getBusinessLine(@Param('id',ParseIntPipe) id: number): Promise<BusinessLine>{
        const bl = await this._businessLineService.get(id);
        return bl;
    }

    @Get()
    async getBusinessLines(): Promise<BusinessLine[]>{
        const bls = await this._businessLineService.getAll();
        return bls;
    }

    @Post()
    async createBusinessLine(@Body() bl: BusinessLine): Promise<BusinessLine>{
        const create = await this._businessLineService.create(bl);
        return create;
    }

    @Put(':id')
    async updateBusinessLine(@Param('id',ParseIntPipe) id: number, @Body() bl: BusinessLine){
        const update = await this._businessLineService.update(id,bl);
        return update;
    }

    @Delete(':id')
    async deleteBusinessLine(@Param('id',ParseIntPipe) id: number){
        await this._businessLineService.delete(id);
        return true;
    }
}
