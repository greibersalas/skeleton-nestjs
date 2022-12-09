import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');
import { Audit } from 'src/modules/security/audit/audit.entity';

import { BankService } from './bank.service';
import { BankDto } from './dto/bank-dto';
import { Bank } from './entity/bank.entity';

@UseGuards(JwtAuthGuard)
@Controller('bank')
export class BankController {

    private module = 'bank';
    constructor(
        private service: BankService
    ) { }

    @Get(':id')
    async getBank(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BankDto> {
        return await this.service.get(id);
    }

    @Get()
    async getBanks(): Promise<BankDto[]> {
        return await this.service.getAll();
    }

    @Post()
    async create(
        @Body() data: BankDto,
        @Request() req: any
    ): Promise<BankDto> {
        const bank: Bank = new Bank();
        bank.name = data.name;
        bank.user = req.user.id;
        const create = await this.service.create(bank);
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
        @Body() body: Bank
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
