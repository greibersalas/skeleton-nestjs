import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { BankAccountsController } from './bank-accounts/bank-accounts.controller';
import { PaymentMethodCardController } from './payment-method-card/payment-method-card.controller';

// Services
import { BankAccountsService } from './bank-accounts/bank-accounts.service';
import { PaymentMethodCardService } from './payment-method-card/payment-method-card.service';

// Entity
import { BankAccounts } from './bank-accounts/entity/bank-accounts.entity';
import { PaymentMethodCard } from './payment-method-card/entity/payment-method-card.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BankAccounts,
            PaymentMethodCard
        ])
    ],
    controllers: [
        BankAccountsController,
        PaymentMethodCardController
    ],
    providers: [
        BankAccountsService,
        PaymentMethodCardService
    ]
})
export class FinanceMatModule { }
