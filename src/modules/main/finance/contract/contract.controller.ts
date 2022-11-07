import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

// Entity
import { Audit } from 'src/modules/security/audit/audit.entity';
import { Contract } from './entity/contract.entity';

import { ContractService } from './contract.service';
import { ContractDetailDto } from './dto/contract-detail-dto';
import { ContractDto } from './dto/contract-dto';
import { ContractDetail } from './entity/contract-detail.entity';

@UseGuards(JwtAuthGuard)
@Controller('contract')
export class ContractController {

    private module = 'contract';
    constructor(
        private service: ContractService
    ) { }

    @Get(':id')
    async getOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractDto> {
        return await this.service.getOne(id);
    }

    @Get('/detail/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ContractDetailDto[]> {
        return await this.service.getDataDetail(id);
    }

    @Get()
    async getAll(): Promise<ContractDto[]> {
        return await this.service.getAll();
    }

    @Post('/filters')
    async getDataFilters(
        @Body() body: any
    ): Promise<ContractDto[]> {
        return await this.service.getDataFilters(body);
    }

    @Post('/pending')
    async getDataFiltersPending(
        @Body() body: any
    ): Promise<ContractDto[]> {
        return await this.service.getDataFilters(body, 1);
    }

    @Post()
    async create(
        @Body() data: ContractDto,
        @Request() req: any
    ): Promise<Contract> {
        const order: Contract = new Contract();
        order.clinichistory = data.idclinichistory;
        order.type = data.type;
        order.user = Number(req.user.id);
        const create = await this.service.create(order);
        // Insertamos el detalle
        if (create) {
            for await (const item of data.detail) {
                if (item.check) {
                    const det: ContractDetail = new ContractDetail();
                    det.contract = create;
                    det.description = item.description;
                    det.observation = item.observation;
                    det.date = item.date;
                    det.amount = item.amount;
                    det.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                    det.user = Number(req.user.id);
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
        @Body() data: Contract,
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
