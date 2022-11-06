import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';

// Entity
import { ServiceOrderDetail } from './entity/service-order-detail.entity';
import { ServiceOrder } from './entity/service-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrder, ServiceOrderDetail])],
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService]
})
export class ServiceOrderModule { }
