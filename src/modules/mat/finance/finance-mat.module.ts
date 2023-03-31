import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { BankAccountsController } from './bank-accounts/bank-accounts.controller';
import { DiscountTypeController } from './discount-type/discount-type.controller';
import { ExchangeHouseController } from './exchange-house/exchange-house.controller';
import { PaymentMethodCardController } from './payment-method-card/payment-method-card.controller';

// Services
import { BankAccountsService } from './bank-accounts/bank-accounts.service';
import { ExchangeHouseService } from './exchange-house/exchange-house.service';
import { PaymentMethodCardService } from './payment-method-card/payment-method-card.service';

// Entity
import { BankAccounts } from './bank-accounts/entity/bank-accounts.entity';
import { DiscountTypeService } from './discount-type/discount-type.service';
import { DiscountType } from './discount-type/entity/discount-type.entity';
import { ExchangeHouse } from './exchange-house/entity/exchange-house.entity';
import { PaymentMethodCard } from './payment-method-card/entity/payment-method-card.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BankAccounts,
            PaymentMethodCard,
            DiscountType,
            ExchangeHouse
        ]),
    ],
    controllers: [
        BankAccountsController,
        PaymentMethodCardController,
        DiscountTypeController,
        ExchangeHouseController
    ],
    providers: [
        BankAccountsService,
        PaymentMethodCardService,
        DiscountTypeService,
        ExchangeHouseService
    ]
})
export class FinanceMatModule { }
