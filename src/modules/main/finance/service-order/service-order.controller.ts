import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
import { ServiceOrder } from './entity/service-order.entity';
import { ServiceOrderDetail } from './entity/service-order-detail.entity';
// Dto
import { ServiceOrderDto } from './dto/service-order-dto';

// Service
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderDetailDto } from './dto/service-order-detail-dto';

@UseGuards(JwtAuthGuard)
@Controller('service-order')
export class ServiceOrderController {

    private module = 'service-order';
    constructor(
        private service: ServiceOrderService
    ) { }

    @Get(':id')
    async getOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ServiceOrderDto> {
        return await this.service.getOne(id);
    }

    @Get('/detail/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ServiceOrderDetailDto[]> {
        return await this.service.getDataDetail(id);
    }

    @Get()
    async getAll(): Promise<ServiceOrderDto[]> {
        return await this.service.getAll();
    }

    @Post('/filters')
    async getDataFilters(
        @Body() body: any
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataFilters(body);
    }

    @Post('/pending')
    async getDataFiltersPending(
        @Body() body: any
    ): Promise<ServiceOrderDto[]> {
        return await this.service.getDataFilters(body, 1);
    }

    @Post()
    async create(
        @Body() data: ServiceOrderDto,
        @Request() req: any
    ): Promise<ServiceOrder> {
        const order: ServiceOrder = new ServiceOrder();
        order.clinichistory = data.idclinichistory;
        order.type = data.type;
        order.user = Number(req.user.id);
        order.idorigin = data.idorigin;
        const create = await this.service.create(order);
        // Insertamos el detalle
        if (create) {
            for await (const item of data.detail) {
                if (item.check) {
                    const det: ServiceOrderDetail = new ServiceOrderDetail();
                    det.serviceorder = create;
                    det.tariff = item.idtariff;
                    det.coin = item.idcoin;
                    det.quantity = item.quantity;
                    det.price = item.price;
                    det.total = item.total;
                    det.idorigin = item.idorigin;
                    await this.service.insertDetail(det);
                }
            }
        }
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
        @Body() data: ServiceOrder,
        @Request() req: any
    ) {
        const update = await this.service.update(id, data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Update registro';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Put('/set-data-invoice/:id')
    async setDataInvoice(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ServiceOrder,
        @Request() req: any
    ) {
        data.user = Number(req.user.id);
        const update = await this.service.setDataInvoice(id, data);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Data factara';
        audit.data = JSON.stringify(update);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return update;
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        await this.service.delete(id);
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = this.module;
        audit.description = 'Delete registro';
        audit.data = null;
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        //Respondemos al usuario
        return true;
    }
}
