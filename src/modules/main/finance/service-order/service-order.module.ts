import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';

// Entity
import { ViewServiceOrder } from './entity/service-order-view.entity';
import { MedicalActAttention } from '../../medical-act-attention/medical-act-attention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ViewServiceOrder,
    MedicalActAttention
  ])],
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService]
})
export class ServiceOrderModule { }
