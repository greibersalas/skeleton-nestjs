import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
import { ServiceOrder } from './entity/service-order.entity';

// Service
import { ServiceOrderService } from './service-order.service';

@UseGuards(JwtAuthGuard)
@Controller('service-order')
export class ServiceOrderController {

    private module = 'service-order';
    constructor(
        private service: ServiceOrderService
    ) { }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceOrder> {
        return await this.service.getOne(id);
    }

    @Get()
    async getAll(): Promise<ServiceOrder[]> {
        return await this.service.getAll();
    }

    @Post()
    async create(
        @Body() data: ServiceOrder,
        @Request() req: any
    ): Promise<ServiceOrder> {
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
