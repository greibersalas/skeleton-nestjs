import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

import { Audit } from 'src/modules/security/audit/audit.entity';
import { PaymentMethodCardDto } from './dto/payment-method-card-dto';
import { PaymentMethodCard } from './entity/payment-method-card.entity';
import { PaymentMethodCardService } from './payment-method-card.service';

@UseGuards(JwtAuthGuard)
@Controller('payment-method-card')
export class PaymentMethodCardController {

    private module = 'payment-method-card';
    constructor(
        private service: PaymentMethodCardService
    ) { }

    @Get(':id')
    async getBank(
        @Param('id', ParseIntPipe) id: number
    ): Promise<PaymentMethodCardDto> {
        const data = await this.service.get(id);
        let card: PaymentMethodCardDto;
        card.id = data.id;
        card.name = data.name;
        card.status = data.status;
        return card
    }

    @Get()
    async getBanks(): Promise<PaymentMethodCardDto[]> {
        const data = await this.service.getAll();
        return data.map(el => {
            let card: PaymentMethodCardDto;
            card = {
                id: el.id,
                name: el.name,
                status: el.status
            }
            return card;
        });
    }

    @Post()
    async create(
        @Body() data: PaymentMethodCard,
        @Request() req: any
    ): Promise<PaymentMethodCard> {
        data.user = req.user.id;
        const create = await this.service.create(data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = create.id;
        audit.title = this.module;
        audit.description = 'Insert registro';
        audit.data = JSON.stringify(create);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return create;
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: PaymentMethodCard
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
