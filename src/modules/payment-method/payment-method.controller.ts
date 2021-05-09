import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { PaymentMethod } from './payment-method.entity';
import { PaymentMethodService } from './payment-method.service';
@UseGuards(JwtAuthGuard)
@Controller('payment-method')
export class PaymentMethodController {

    constructor(private readonly _pmService: PaymentMethodService){}

    @Get(':id')
    async getPaymentMethod(@Param('id',ParseIntPipe) id: number): Promise<PaymentMethod>{
        const pm = await this._pmService.get(id);
        return pm;
    }

    @Get()
    async getPaymentMethods(): Promise<PaymentMethod[]>{
        const pm = await this._pmService.getAll();
        return pm;
    }

    @Post()
    async createPaymentMethod(@Body() pm: PaymentMethod): Promise<PaymentMethod>{
        const create = await this._pmService.create(pm);
        return create;
    }

    @Put(':id')
    async updatePaymentMethod(@Param('id',ParseIntPipe) id: number, @Body() pm: PaymentMethod){
        const update = await this._pmService.update(id,pm);
        return update;
    }

    @Delete(':id')
    async deletePaymentMethod(@Param('id',ParseIntPipe) id: number){
        await this._pmService.delete(id);
        return true;
    }
}
