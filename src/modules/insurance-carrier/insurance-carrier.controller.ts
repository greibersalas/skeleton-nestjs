import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { InsuranceCarrier } from './insurance-carrier.entity';
import { InsuranceCarrierService } from './insurance-carrier.service';

@UseGuards(JwtAuthGuard)
@Controller('insurance-carrier')
export class InsuranceCarrierController {

    constructor(private readonly _icService: InsuranceCarrierService){}

    @Get(':id')
    async getInsuranceCarrier(@Param('id',ParseIntPipe) id: number): Promise<InsuranceCarrier>{
        const bl = await this._icService.get(id);
        return bl;
    }

    @Get()
    async getInsuranceCarriers(): Promise<InsuranceCarrier[]>{
        const ics = await this._icService.getAll();
        return ics;
    }

    @Post()
    async createInsuranceCarrier(@Body() ic: InsuranceCarrier): Promise<InsuranceCarrier>{
        const create = await this._icService.create(ic);
        return create;
    }

    @Put(':id')
    async updateInsuranceCarrier(@Param('id',ParseIntPipe) id: number, @Body() ic: InsuranceCarrier){
        const update = await this._icService.update(id,ic);
        return update;
    }

    @Delete(':id')
    async deleteInsuranceCarrier(@Param('id',ParseIntPipe) id: number){
        await this._icService.delete(id);
        return true;
    }
}
