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
import { DiscountTypeController } from './discount-type/discount-type.controller';
import { DiscountTypeService } from './discount-type/discount-type.service';
import { DiscountType } from './discount-type/entity/discount-type.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BankAccounts,
            PaymentMethodCard,
            DiscountType
        ])
    ],
    controllers: [
        BankAccountsController,
        PaymentMethodCardController,
        DiscountTypeController
    ],
    providers: [
        BankAccountsService,
        PaymentMethodCardService,
        DiscountTypeService
    ]
})
export class FinanceMatModule { }
