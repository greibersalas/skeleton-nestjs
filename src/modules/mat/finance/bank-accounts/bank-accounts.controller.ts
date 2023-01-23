import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/strategies/jwt-auth.guard';
const moment = require('moment-timezone');

import { Audit } from 'src/modules/security/audit/audit.entity';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsDto } from './dto/bank-accounts-dto';
import { BankAccounts } from './entity/bank-accounts.entity';

@UseGuards(JwtAuthGuard)
@Controller('bank-accounts')
export class BankAccountsController {

    private module = 'bank-accounts';
    constructor(
        private service: BankAccountsService
    ) { }

    @Get(':id')
    async getBank(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BankAccountsDto> {
        const data = await this.service.get(id);
        let bankAccount: BankAccountsDto;
        bankAccount.id = data.id;
        bankAccount.bank = data.bank.id;
        bankAccount.bank_name = data.bank.name;
        bankAccount.coin = data.coin.id;
        bankAccount.coin_name = data.coin.name;
        bankAccount.account_num = data.account_num;
        bankAccount.beneficiary = data.beneficiary;
        bankAccount.status = data.status;
        return bankAccount
    }

    @Get()
    async getBanks(): Promise<BankAccountsDto[]> {
        const data = await this.service.getAll();
        return data.map(el => {
            let bankAccount: BankAccountsDto;
            bankAccount = {
                id: el.id,
                bank: el.bank.id,
                bank_name: el.bank.name,
                coin: el.coin.id,
                coin_name: el.coin.name,
                account_num: el.account_num,
                beneficiary: el.beneficiary,
                amount: el.amount,
                status: el.status
            }
            return bankAccount;
        });
    }

    @Post()
    async create(
        @Body() data: BankAccounts,
        @Request() req: any
    ): Promise<BankAccounts> {
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
        @Body() body: BankAccounts
    ) {
        return await this.service.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
