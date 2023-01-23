import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsController } from './bank-accounts/bank-accounts.controller';
import { BankAccountsService } from './bank-accounts/bank-accounts.service';
import { BankAccounts } from './bank-accounts/entity/bank-accounts.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BankAccounts])],
    controllers: [BankAccountsController],
    providers: [BankAccountsService]
})
export class FinanceMatModule { }
