import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodRepository } from './payment-method.repository';
import { PaymentMethodService } from './payment-method.service';

@Module({
  imports: [ TypeOrmModule.forFeature([PaymentMethodRepository])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService]
})
export class PaymentMethodModule {}
