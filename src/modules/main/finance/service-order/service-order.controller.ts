import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';

// Service
import { ServiceOrderService } from './service-order.service';

@UseGuards(JwtAuthGuard)
@Controller('service-order')
export class ServiceOrderController {

    private module = 'service-order';
    constructor(
        private service: ServiceOrderService
    ) { }

    @Get('/pending/:date')
    async getDataPending(
        @Param('date') date: string
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataPending(date);
    }

    @Put(':id')
    async updateServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ServiceOrderDto,
        @Request() req: any
    ) {
        const update = await this.service.setPaymentData(id, data, Number(req.user.id));
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = data.origin === 'attention' ? 'medical-act-attention' : 'contract-quota-payment';
        audit.description = 'Data del pago y facturación';
        audit.data = JSON.stringify(data);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Put('decline/:id/:origin')
    async declineServiceOrder(
        @Param('id', ParseIntPipe) id: number,
        @Param('origin') origin: string,
        @Request() req: any
    ) {
        const data = await this.service.setDecline(id, origin);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'medical-act-attention';
        audit.description = 'Rechazo de la orden de servicio';
        audit.data = JSON.stringify(data);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return data;
    }

}
